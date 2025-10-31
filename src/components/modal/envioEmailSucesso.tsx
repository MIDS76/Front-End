"use client";

interface EnvioSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnvioSuccessModal({ isOpen, onClose }: EnvioSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white px-8 py-12 rounded-xl shadow-2xl max-w-md relative">
   
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

     
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">E-mail enviado com sucesso!</h2>
          
          <p className="font-semibold text-gray-900 mb-4">
            O link de redefinição de senha foi enviado
          </p>
          
          <p className="text-gray-600 mb-6 text-sm">
            Enviamos agora um e-mail com um link que você pode usar para redefinir sua senha. Pode levar alguns minutos até que chegue a sua caixa de entrada.
          </p>

       
          <hr className="my-6 border-gray-300" />

        
          <div className="text-left bg-gray-50 p-4 rounded-lg mb-6">
            <p className="font-semibold text-gray-900 mb-2">Não está recebendo um e-mail?</p>
            <p className="text-gray-600 text-sm mb-2">
              Caso tenha aguardado mais de 5 minutos e ainda não tenha recebido o e-mail, siga as instruções abaixo:
            </p>
            <ul className="text-gray-600 text-sm list-disc pl-5 space-y-1">
              <li>Verifique suas pastas de spam/lixo eletrônico.</li>
              <li>Entre em contato com o administrador da rede e peça para adicionar <strong>site.com</strong> como um domínio permitido no seu servidor de e-mail.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
