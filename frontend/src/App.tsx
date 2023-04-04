
import Main from './components/Main'
import Toaster from './components/Toaster'
import { WagmiConfig } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { chains, wagmiClient } from "./config/walletConfig"
import "@rainbow-me/rainbowkit/styles.css"
import { Dialog } from '@headlessui/react'
import {useState} from "react"
import { BsReverseLayoutTextSidebarReverse } from 'react-icons/bs';
import {RiCloseCircleLine} from 'react-icons/ri'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import logo from "./assets/logo.png"

const navigation = [
	{ name: 'Home', href: '#' },
	{ name: 'Collections', href: '#' },
	]
  
function App() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	return (
		<>
    <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains}>
		 <header className="absolute inset-x-0 top-0 mb-20 font-Fredoka z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <h3 className="text-yellow font-AgrandirGrandHeavy leading-[62px] font-extrabold text-5xl">
						ZK
						<span className='text-blue-600'>Claims</span>
					</h3>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <BsReverseLayoutTextSidebarReverse className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:flex-1  lg:gap-x-12 lg:justify-end">
          {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-lg py-2 font-semibold leading-6  text-gray-900">
                {item.name}
              </a>
            ))}
              <ConnectButton />
          </div>
        </nav>
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt=""
                />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <RiCloseCircleLine className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                 <ConnectButton />
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
			<Main />

			<div className="fixed bottom-5 left-1/2 -translate-x-1/2 -z-10">
				<h3 className="text-xl text-white text-opacity-70 w-full whitespace-nowrap">
					Made with 💙  by ZKClaims
				</h3>
			</div>

			<Toaster />
      </RainbowKitProvider>
    </WagmiConfig>
		</>
	)
}

export default App
