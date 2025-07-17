#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
نقطة دخول التطبيق - Smart Calculator
حاسبة الجمع الذكية للأندرويد
"""

__version__ = '1.0'

# استيراد التطبيق الرئيسي
from mobile_app import CalculatorApp

if __name__ == '__main__':
    try:
        app = CalculatorApp()
        app.run()
    except Exception as e:
        print(f"خطأ في تشغيل التطبيق: {e}")
        import traceback
        traceback.print_exc()
