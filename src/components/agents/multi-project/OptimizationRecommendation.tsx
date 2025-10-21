import {
  CheckCircle2,
  Target,
  AlertCircle,
  Brain,
} from "lucide-react";

interface OptimizationRecommendationProps {
  type: "success" | "info" | "warning" | "insight";
  title: string;
  description: string;
}

export function OptimizationRecommendation({
  type,
  title,
  description,
}: OptimizationRecommendationProps) {
  const getRecommendationConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle2,
          bgColor: "bg-green-50",
          borderColor: "border-green-500",
          iconColor: "text-green-600",
          titleColor: "text-green-800",
          textColor: "text-green-700",
        };
      case "info":
        return {
          icon: Target,
          bgColor: "bg-blue-50",
          borderColor: "border-blue-500",
          iconColor: "text-blue-600",
          titleColor: "text-blue-800",
          textColor: "text-blue-700",
        };
      case "warning":
        return {
          icon: AlertCircle,
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-500",
          iconColor: "text-yellow-600",
          titleColor: "text-yellow-800",
          textColor: "text-yellow-700",
        };
      case "insight":
        return {
          icon: Brain,
          bgColor: "bg-purple-50",
          borderColor: "border-purple-500",
          iconColor: "text-purple-600",
          titleColor: "text-purple-800",
          textColor: "text-purple-700",
        };
      default:
        return {
          icon: AlertCircle,
          bgColor: "bg-gray-50",
          borderColor: "border-gray-500",
          iconColor: "text-gray-600",
          titleColor: "text-gray-800",
          textColor: "text-gray-700",
        };
    }
  };

  const config = getRecommendationConfig();
  const IconComponent = config.icon;

  return (
    <div
      className={`flex items-start gap-3 p-4 ${config.bgColor} rounded-lg border-l-4 ${config.borderColor}`}
    >
      <IconComponent
        className={`h-5 w-5 ${config.iconColor} mt-0.5`}
      />
      <div>
        <div className={`font-medium ${config.titleColor}`}>
          {title}
        </div>
        <div className={`text-sm ${config.textColor}`}>
          {description}
        </div>
      </div>
    </div>
  );
}