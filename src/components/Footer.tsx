
import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

export function Footer() {
  return (
    <footer className="mt-auto border-t">
      <div className="container py-4 px-4 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
        <p>© 2024 EVJI - Escritório Virtual Jurídico Inteligente</p>
        
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <AlertDialog>
            <AlertDialogTrigger className="underline hover:text-foreground transition-colors">
              Aviso de Responsabilidade
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Aviso de Responsabilidade</AlertDialogTitle>
                <AlertDialogDescription className="text-base space-y-4">
                  <p>
                    O EVJI (Escritório Virtual Jurídico Inteligente) é uma plataforma que utiliza inteligência artificial para fornecer suporte automatizado a profissionais jurídicos. É importante compreender que:
                  </p>
                  
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Este serviço NÃO substitui o aconselhamento jurídico profissional humano.</li>
                    <li>Todo o conteúdo gerado é produzido automaticamente com base nas informações fornecidas e pode conter imprecisões.</li>
                    <li>É responsabilidade do usuário revisar, validar e adaptar qualquer informação ou documento antes de seu uso oficial.</li>
                    <li>O EVJI não se responsabiliza por decisões tomadas com base em seu conteúdo sem a devida validação profissional.</li>
                  </ul>
                  
                  <p>
                    Recomendamos fortemente que todos os usuários leiam nossos Termos de Uso completos antes de utilizar a plataforma.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger className="underline hover:text-foreground transition-colors">
              Termos de Uso
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <AlertDialogHeader>
                <AlertDialogTitle>Termos de Uso</AlertDialogTitle>
                <AlertDialogDescription className="text-base space-y-4">
                  <section className="space-y-2">
                    <h3 className="font-medium text-foreground">1. Objeto</h3>
                    <p>
                      O EVJI é uma plataforma de assistência jurídica automatizada que utiliza inteligência artificial para auxiliar profissionais do direito em suas atividades.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-medium text-foreground">2. Aceitação dos Termos</h3>
                    <p>
                      Ao utilizar o EVJI, você concorda com estes termos de uso. Se você não concorda com algum aspecto destes termos, não utilize a plataforma.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-medium text-foreground">3. Responsabilidades do Usuário</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Fornecer informações precisas e verdadeiras</li>
                      <li>Manter a confidencialidade de suas credenciais de acesso</li>
                      <li>Revisar e validar todo conteúdo gerado antes do uso</li>
                      <li>Utilizar a plataforma de acordo com a legislação vigente</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-medium text-foreground">4. Limitação de Responsabilidade</h3>
                    <p>
                      O EVJI não se responsabiliza por:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Decisões tomadas com base no conteúdo gerado sem validação profissional</li>
                      <li>Perdas ou danos decorrentes do uso da plataforma</li>
                      <li>Imprecisões ou erros no conteúdo gerado automaticamente</li>
                      <li>Indisponibilidade temporária do serviço</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-medium text-foreground">5. Privacidade e Dados</h3>
                    <p>
                      O EVJI se compromete a:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Proteger as informações fornecidas pelos usuários</li>
                      <li>Utilizar dados apenas para os fins especificados</li>
                      <li>Não compartilhar informações sensíveis com terceiros</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-medium text-foreground">6. Modificações nos Termos</h3>
                    <p>
                      O EVJI se reserva o direito de modificar estes termos a qualquer momento, notificando os usuários sobre alterações significativas.
                    </p>
                  </section>
                </AlertDialogDescription>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </footer>
  );
}
