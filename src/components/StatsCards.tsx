import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { payrollAPI } from "@/Data/payrollAPI";

interface Stat {
  title: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  mainValue: string | number;
  minValue?: string | number;
}

export const StatsCards = () => {
  const [monthlyMain, setMonthlyMain] = useState<string>("USD 0.00");
  const [monthlyMin, setMonthlyMin] = useState<string>("$0.00");
  const [employeesMain, setEmployeesMain] = useState<number>(0);
  const [employeesMin] = useState<string>("0 New");

  const fmtUSD = (n: number) => `USD ${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtDollar = (n: number) => `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch transaction stats for Monthly Payroll
        const tsRes = await payrollAPI.getTransstats();
        const ts = tsRes?.data;
        let total = 0;
        if (ts && typeof ts === 'object') {
          const candidates = [
            ts.totalUSD,
            ts.total,
            ts.monthlyTotal,
            ts.amount,
            ts.value,
            ts.sum,
          ];
          total = Number(candidates.find((v) => typeof v === 'number')) || 0;
          if (!total && Array.isArray(ts.data)) {
            total = ts.data.reduce((acc: number, item: any) => acc + Number(item?.amount ?? item?.value ?? 0), 0);
          }
        }
        setMonthlyMain(fmtUSD(total));
        // Try to find a secondary stat, else keep default
        const secondary = ts?.previousMonthUSD ?? ts?.previousMonth ?? ts?.min ?? ts?.lowest ?? 0;
        setMonthlyMin(fmtDollar(Number(secondary) || 0));

        // Fetch employees paid count
        const empRes = await payrollAPI.getEmployeePayroll();
        const payload = empRes?.data;
        const list = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.employees)
            ? payload.employees
            : Array.isArray(payload)
              ? payload
              : [];
        const count = Array.isArray(list) ? list.length : Number(payload?.count ?? payload?.totalPaidEmployees ?? 0);
        setEmployeesMain(count);
      } catch (e) {
        // Keep defaults on error
        setMonthlyMain("USD 0.00");
        setMonthlyMin("$0.00");
        setEmployeesMain(0);
      }
    };
    fetchStats();
  }, []);

  const stats: Stat[] = [
    {
      title: "Monthly Payroll",
      icon: TrendingUp,
      mainValue: monthlyMain,
      minValue: monthlyMin,
    },
    {
      title: "Employees Paid This Month",
      icon: Users,
      mainValue: employeesMain,
      minValue: employeesMin,
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row w-full gap-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="bg-stone-900 border-stone-700 p-6 w-full h-40"
        >
          <CardContent className="p-0 flex flex-col justify-center h-full gap-2">
            {/* Title & Icon */}
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-stone-700/20 rounded-lg flex-shrink-0">
                <stat.icon className="w-5 h-5 text-stone-300/80" />
              </div>
              <h3 className="text-xl font-medium text-stone-300/80">{stat.title}</h3>
            </div>

            {/* Main Value */}
            <p className="text-3xl font-medium text-white">{stat.mainValue}</p>

            {/* Min / secondary value */}
            {stat.minValue && (
              <p className="text-base font-medium text-stone-300/80">{stat.minValue}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
