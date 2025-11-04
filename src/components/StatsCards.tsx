import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users } from "lucide-react";

interface Stat {
  title: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  mainValue: string | number;
  minValue?: string | number;
}

export const StatsCards = () => {
  const stats: Stat[] = [
    {
      title: "Monthly Payroll",
      icon: TrendingUp,
      mainValue: "USD 0.00",
      minValue: "$0.00",
    },
    {
      title: "Employees Paid This Month",
      icon: Users,
      mainValue: 5,
      minValue: "0 New",
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
