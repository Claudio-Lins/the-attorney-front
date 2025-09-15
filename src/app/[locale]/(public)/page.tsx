import { SignOut } from '@/components/auth/sign-out';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/animated-container';
import { auth } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';

export default async function Home() {
   const session = await auth();
   
   console.log("Session no Home:", JSON.stringify(session, null, 2));
   
  const t = await getTranslations('HomePage');
  
  return (
    <div className="min-h-screen">
      {/* Hero Section com imagem de fundo */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Imagem de fundo com overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        {/* Conteúdo da hero */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
          <FadeIn delay={0.2}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              {t('title')}
            </h1>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p className="text-xl sm:text-2xl lg:text-3xl mb-8 opacity-90">
              Bem-vindo ao seu novo projeto
            </p>
          </FadeIn>
          <FadeIn delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Começar Agora
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Saber Mais
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Seção de conteúdo */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <StaggerItem>
              <div className="bg-card p-6 rounded-lg shadow-lg border border-border hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:border-primary/50">
                <h3 className="text-xl font-semibold mb-4 text-card-foreground">
                  Recursos Modernos
                </h3>
                <p className="text-muted-foreground">
                  Construído com as tecnologias mais recentes para performance e experiência do usuário.
                </p>
              </div>
            </StaggerItem>

            {/* Card 2 */}
            <StaggerItem>
              <div className="bg-card p-6 rounded-lg shadow-lg border border-border hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:border-primary/50">
                <h3 className="text-xl font-semibold mb-4 text-card-foreground">
                  Design Responsivo
                </h3>
                <p className="text-muted-foreground">
                  Interface adaptável que funciona perfeitamente em todos os dispositivos.
                </p>
              </div>
            </StaggerItem>

            {/* Card 3 */}
            <StaggerItem>
              <div className="bg-card p-6 rounded-lg shadow-lg border border-border hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:border-primary/50">
                <h3 className="text-xl font-semibold mb-4 text-card-foreground">
                  Fácil de Usar
                </h3>
                <p className="text-muted-foreground">
                  Experiência intuitiva e navegação simplificada para todos os usuários.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Seção de informações da sessão - apenas para debug */}
      {session && (
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
                <h3 className="text-lg font-semibold mb-4 text-card-foreground">
                  Informações da Sessão (Debug)
                </h3>
                <pre className="text-sm text-muted-foreground overflow-x-auto bg-muted p-4 rounded-lg">
                  {JSON.stringify(session, null, 2)}
                </pre>
                <div className="mt-4">
                  <SignOut />
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}
    </div>
  );
}
