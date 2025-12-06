export default function Footer() {
  return (
    <footer className="h-18 flex p-4 bg-gradient-to-r from-blue-600 to-blue-500 transition-opacity ease-in-out duration-initial backdrop-opacity-95 text-white">
      <div className="w-full flex justify-center">
        <div className="flex px-4">
          <div className="flex items-center">
            <p className="text-xs">
              GarageHub - H&R - ADS 2025/4 © 
            </p>
            {/* TODO: implementar links de redes sociais */}
          </div>
        </div>
      </div>
    </footer>
  );
}
