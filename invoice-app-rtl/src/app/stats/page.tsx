"use client";

import React, { useMemo } from 'react';
import { useInvoices } from '@/context/invoices-context';
import { Header } from '@/components/header';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowDown, ArrowUp, DollarSign, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

// دالة لتنسيق العملة
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
    }).format(amount);
};

// مكون لعرض بطاقة إحصائية
const StatCard = ({ title, value, icon, details }: { title: string, value: string, icon: React.ReactNode, details?: string }) => (
    <div className="bg-card p-6 rounded-lg border flex items-start justify-between">
        <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {details && <p className="text-xs text-muted-foreground">{details}</p>}
        </div>
        <div className="bg-primary/10 text-primary p-3 rounded-lg">
            {icon}
        </div>
    </div>
);

// مكون لعرض مخطط الإيرادات
const RevenueChart = ({ data }: { data: any[] }) => (
    <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">ملخص الإيرادات الشهري</h3>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" reversed={true} />
                <YAxis tickFormatter={(value) => formatCurrency(value as number)} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar dataKey="الإيرادات" fill="#8884d8" name="الإيرادات (مدفوع)" />
                <Bar dataKey="المعلق" fill="#82ca9d" name="المعلق" />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

export default function StatsPage() {
    const { invoices } = useInvoices();

    // حساب الإحصائيات باستخدام useMemo لتحسين الأداء
    const stats = useMemo(() => {
        const totalRevenue = invoices
            .filter(inv => inv.status === 'paid')
            .reduce((sum, inv) => sum + inv.totalAmount, 0);

        const pendingAmount = invoices
            .filter(inv => inv.status === 'pending')
            .reduce((sum, inv) => sum + inv.totalAmount, 0);

        const invoiceCount = invoices.length;
        const paidCount = invoices.filter(inv => inv.status === 'paid').length;

        // تجميع البيانات للمخطط
        const monthlyData: { [key: string]: { "الإيرادات": number, "المعلق": number } } = {};
        invoices.forEach(inv => {
            const month = new Date(inv.issueDate).toLocaleString('ar-EG', { month: 'long', year: 'numeric' });
            if (!monthlyData[month]) {
                monthlyData[month] = { "الإيرادات": 0, "المعلق": 0 };
            }
            if (inv.status === 'paid') {
                monthlyData[month]["الإيرادات"] += inv.totalAmount;
            } else if (inv.status === 'pending') {
                monthlyData[month]["المعلق"] += inv.totalAmount;
            }
        });

        const chartData = Object.keys(monthlyData).map(month => ({
            name: month,
            ...monthlyData[month]
        })).reverse(); // عرض أحدث الشهور أولاً

        return { totalRevenue, pendingAmount, invoiceCount, paidCount, chartData };
    }, [invoices]);

    return (
        <div className="bg-background min-h-screen">
            <Header />
            <main className="container mx-auto p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold tracking-tight">الإحصائيات والتقارير</h2>
                        <p className="text-muted-foreground">نظرة عامة على أداء فواتيرك.</p>
                    </div>

                    {/* شبكة عرض الإحصائيات */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                    <StatCard title="إجمالي الإيرادات" value={formatCurrency(stats.totalRevenue)} icon={<DollarSign />} details={`${stats.paidCount} فاتورة مدفوعة`} />
                    <StatCard title="المبلغ المعلق" value={formatCurrency(stats.pendingAmount)} icon={<ArrowUp />} />
                    <StatCard title="إجمالي الفواتير" value={stats.invoiceCount.toString()} icon={<FileText />} />
                    <StatCard title="نسبة التحصيل" value={`${stats.invoiceCount > 0 ? ((stats.paidCount / stats.invoiceCount) * 100).toFixed(0) : 0}%`} icon={<ArrowDown />} />
                </div>

                {/* المخطط البياني */}
                <RevenueChart data={stats.chartData} />
                </motion.div>
            </main>
        </div>
    );
}
