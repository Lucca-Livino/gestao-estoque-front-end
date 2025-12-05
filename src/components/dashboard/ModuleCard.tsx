import { ModuleCard as ModuleCardType } from "@/types/Dashboard";

interface ModuleCardProps {
  card: ModuleCardType;
}

export default function ModuleCard({ card }: ModuleCardProps) {
  const { title, description, iconSrc, iconAlt, onClick, href } = card;

  const cardContent = (
    <div className="bg-white rounded-xl p-12 text-blue-900 hover:shadow-[0_0_25px_rgba(0,0,0,0.15)] transition-all cursor-pointer min-h-[180px] flex items-center shadow-[0_0_15px_rgba(0,0,0,0.1)]">
      <div className="flex items-center space-x-6 w-full">
        <div className="bg-blue-500 p-6 rounded-xl flex items-center pl-8">
          <img src={iconSrc} alt={iconAlt} className="w-14 h-14" />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-3">{title}</h2>
          <p className="text-blue-900 text-lg">{description}</p>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href}>
        {cardContent}
      </a>
    );
  }

  if (onClick) {
    return (
      <div onClick={onClick}>
        {cardContent}
      </div>
    );
  }

  return cardContent;
}