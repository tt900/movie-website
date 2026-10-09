import 'package:flutter/material.dart';

import '../models/day_state.dart';
import '../services/storage_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _noteController = TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final StorageService _storage = StorageService();

  DayState _dayState = const IdleDayState();
  String _selectedSeal = '';

  @override
  void initState() {
    super.initState();
    _loadState();
  }

  Future<void> _loadState() async {
    final stored = await _storage.loadTodayState();

    setState(() {
      _noteController.text = stored.note;
      _selectedSeal = stored.seal;

      if (stored.isActive) {
        _dayState = ActiveDayState(stored.remainingDays);
      } else if (stored.remainingDays >= 12) {
        _dayState = const CompletedDayState();
      } else {
        _dayState = const IdleDayState();
      }
    });
  }

  Future<void> _saveCurrentState() async {
    final remainingDays = switch (_dayState) {
      ActiveDayState(:final remainingDays) => remainingDays,
      _ => 0,
    };

    await _storage.saveTodayState(
      remainingDays: remainingDays,
      seal: _selectedSeal,
      note: _noteController.text.trim(),
      isActive: _dayState is ActiveDayState,
    );
  }

  void _activateCountdown() {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _dayState = const ActiveDayState(12);
    });

    _saveCurrentState();
    _storage.appendHistoryEntry(
      'تم تفعيل العد التنازلي في ${StorageService.todayKey()} - ${_noteController.text.trim()}',
    );
  }

  void _decreaseDay() {
    final current = switch (_dayState) {
      ActiveDayState(:final remainingDays) => remainingDays,
      _ => 0,
    };

    if (current <= 0) {
      return;
    }

    final nextValue = current - 1;
    setState(() {
      _dayState = nextValue == 0
          ? const CompletedDayState()
          : ActiveDayState(nextValue);
    });

    _saveCurrentState();
  }

  @override
  Widget build(BuildContext context) {
    final remainingDays = switch (_dayState) {
      ActiveDayState(:final remainingDays) => remainingDays,
      _ => 0,
    };

    return Scaffold(
      appBar: AppBar(
        title: const Text('الرئيسية'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                TextFormField(
                  controller: _noteController,
                  maxLines: 3,
                  textDirection: TextDirection.rtl,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'الرجاء إدخال نص غير فارغ';
                    }
                    return null;
                  },
                  decoration: const InputDecoration(
                    labelText: 'الملاحظة / السؤال',
                    hintText: 'اكتب نصاً غير فارغ',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.edit_note_rounded),
                  ),
                ),
                const SizedBox(height: 20),
                ElevatedButton.icon(
                  onPressed: _activateCountdown,
                  icon: const Icon(Icons.timer_outlined),
                  label: const Text('تفعيل العد التنازلي'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                ),
                const SizedBox(height: 24),
                if (_dayState is ActiveDayState || _dayState is CompletedDayState)
                  Card(
                    elevation: 0,
                    color: Colors.deepPurple.withOpacity(0.08),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        children: [
                          const Text(
                            'العد التنازلي للأيام',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            _dayState is CompletedDayState
                                ? 'تم إكمال المدة بنجاح'
                                : '$remainingDays يوم متبقي',
                            style: const TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.bold,
                              color: Colors.deepPurple,
                            ),
                          ),
                          const SizedBox(height: 12),
                          if (_dayState is ActiveDayState)
                            ElevatedButton(
                              onPressed: _decreaseDay,
                              child: const Text('خصم يوم'),
                            ),
                        ],
                      ),
                    ),
                  ),
                const SizedBox(height: 24),
                const Text(
                  'الختم',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 10,
                  runSpacing: 12,
                  children: ['⭐', '🔥', '✅', '🎯', '💎', '🏆'].map((seal) {
                    final selected = _selectedSeal == seal;
                    return ChoiceChip(
                      label: Text(seal, style: const TextStyle(fontSize: 22)),
                      selected: selected,
                      selectedColor: Colors.deepPurple.shade100,
                      onSelected: (_) {
                        setState(() {
                          _selectedSeal = seal;
                        });
                        _saveCurrentState();
                      },
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
