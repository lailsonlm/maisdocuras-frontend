export function Footer() {
  return (
    <div className="flex flex-col items-center justify-center pb-12 bg-blue-200 border-t-4 border-pink-400">
      <div className="flex gap-1 text-gray-700 text-sm pt-12 sm:text-md">Mais Doçuras 2022 © Todos os direitos reservados</div>
        <div className="flex gap-1 text-gray-700 text-xs mt-2 sm:text-md">
          <h2>Desenvolvido por</h2>
          <a href='https://portfolio-lailsonlm.vercel.app/' target='_blank' rel="noreferrer" className="font-bold hover:brightness-110 transition-all duration-100 hover:underline hover:underline-offset-4">
            Lailson Sobral
          </a>
        </div>
    </div>
  )
}