import Toaster from './components/Toaster'
import { WagmiConfig } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { chains, wagmiClient } from "./config/walletConfig"
import "@rainbow-me/rainbowkit/styles.css"
import { Dialog } from '@headlessui/react'
import {useState,useEffect} from "react"
import { NavLink } from 'react-router-dom'
import { BsReverseLayoutTextSidebarReverse } from 'react-icons/bs';
import {RiCloseCircleLine} from 'react-icons/ri'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react'
import { GETNFT } from './BlockchainServices'

const navigation = [
	{ name: 'Home', href: '/' },
	{ name: 'Collections', href: '/Collections' },
	]
const products = [
        {
          id: 1,
          name: 'Basic Tee',
          href: '#',
          imageSrc: 'https://lh6.googleusercontent.com/Y6vHP0BHHxyAfHr1NmboegaRCGJebInSyn_-p1nbGSj38NKuUUJKjzXEY5SpL8C1poLk8tBg5tcbHgawqlVVjnKFd-iZz7GhKkbmvsbfRlbeJmll2opMAUyo-VYFiMm7_U0OW9v_7ifqwAIpqpP4HDk',
          imageAlt: "Front of men's Basic Tee in black.",
          price: '$35',
          color: 'Black',
        },
        // More products...
      ]
  

function Collections() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [collectiondata, setCollectionData] = useState([]);
    const [datas, setData] = useState('');

    const getcollectiondata = async () => {
        const response = await GETNFT();
        console.log(response, "response from the data");
        setCollectionData(response);
      };

      useEffect(() => {
        getcollectiondata();
      }, []);
    console.log(collectiondata)
    let isFetchCalled = false;
	
	useEffect(() => {
        
		const fetchData = async () => {
		  const response = await fetch(collectiondata[0])
          .then(res => res.text())
          .then(data => setData(data))
          .catch(error => console.log(error));
          console.log("response",datas)
		};
       
		fetchData();
	}, []);
  return (
    <div> <WagmiConfig client={wagmiClient}>
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
        <NavLink  to={item.href} className="text-lg py-2 font-semibold leading-6  text-gray-900">
          {item.name}
        </NavLink>
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
   
        <h3 className="text-yellow font-AgrandirGrandHeavy leading-[62px] font-extrabold text-3xl">
                  ZK
                  <span className='text-blue-600'>Claims</span>
              </h3>
     
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
<div className="flex  items-center w-full h-full max-w-90% lg:max-w-[70%] mx-auto justify-between gap-36 lg:gap-20 flex-col lg:flex-row flex-wrap  max-w-full p-2 lg:p-10 py-20 ">
			<div className="flex flex-col items-center justify-center  max-w-full m-auto text-center lg:text-start lg:items-start">
				<div className="">
				</div>
			</div>
			<div className="max-w-[50%] m-auto">
			</div>
		</div>

        <h3 className="text-4xl pt-5 text-center font-Fredoka text-white text-opacity-70">
                    Collections
					</h3>
                    <div className="">
      <div className="mx-auto max-w-2xl px-4  sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Minted Projects</h2>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="min-h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img
                  src="https://blogger.googleusercontent.com/img/a/AVvXsEivia5Kalm8KJrMeFbvsG6a8-6PT8_kBu3JO5r4ZWMtDoQYAnyQiSY8c7fL6w41TfYY3JFQZvkw0eJDDKFTX17fbXrkX0O_1zAXxGfD9aL804RVhGnUBPf-QviZIxToIyNUlRkASgmqquzvhThll6RicrkGODCkosS5H8emdi9ihuODXrQ-b1hR4Gj1"
                  alt=""
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href={product.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                   ETHAMirtha
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-white">ZKClaims</p>
                </div>
                <p className="text-sm font-medium text-gray-900">vmmuthu31/ZKClaims</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 -z-10">
          <h3 className="text-xl text-white text-opacity-70 w-full whitespace-nowrap">
              Made with 💙  by ZKClaims
          </h3>
      </div>

      <Toaster />
</RainbowKitProvider>
</WagmiConfig></div>
  )
}

export default Collections