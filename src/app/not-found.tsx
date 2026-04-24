import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-[70vh] bg-muted/10 px-4 text-center">
      <div className="space-y-6 max-w-lg">
        <h1 className="text-9xl font-black text-primary/20 relative">
          404
          <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-foreground">
            Қате
          </span>
        </h1>
        <h2 className="text-3xl font-bold">Бұл бет табылған жоқ</h2>
        <p className="text-muted-foreground">
          Кешіріңіз, сіз іздеген бет өшірілген, мекен-жайы өзгерген немесе уақытша қолжетімсіз болуы мүмкін.
        </p>
        <div className="pt-6">
          <Link href="/">
            <Button size="lg" className="gap-2 rounded-full px-8 shadow-lg shadow-primary/20">
              <Home className="w-5 h-5" />
              Басты бетке оралу
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
