import axios from 'axios'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { extractGitHubRepoPath, handleError } from '../utils'
import Form, { Inputs } from './Form'
import QrMessage from './QrMessage'
import Device from '.././assets/Device.svg'
import { MintNFT } from '../BlockchainServices'

const getCallbackUrl = process.env.REACT_APP_BACKEND_BASE_URL + '/home'
const statusUrl = process.env.REACT_APP_BACKEND_BASE_URL + '/status'
const fetchdata = process.env.REACT_APP_BACKEND_BASE_URL

export default function Main() {
	const [callbackId, setCallbackId] = useState<string | null>(null)
	const [status, setStatus] = useState<string | null>(null)
	const [appUrl, setAppUrl] = useState<string | null>(null)
	const [response, SetResponse] = useState()
	async function mintcerti() {
		var data = JSON.stringify({
		  pinataOptions: {
			cidVersion: 1,
		  },
		  pinataMetadata: {
			name: "testing",
			keyvalues: {
			  customKey: "customValue",
			  customKey2: "customValue2",
			},
		  },
		
		  pinataContent: {
			Claims: response,
			Image:
			  "https://lh6.googleusercontent.com/Y6vHP0BHHxyAfHr1NmboegaRCGJebInSyn_-p1nbGSj38NKuUUJKjzXEY5SpL8C1poLk8tBg5tcbHgawqlVVjnKFd-iZz7GhKkbmvsbfRlbeJmll2opMAUyo-VYFiMm7_U0OW9v_7ifqwAIpqpP4HDk",
		  },
		});
	
		var config = {
		  method: "post",
		  url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
		  headers: {
			"Content-Type": "application/json",
			pinata_api_key: "519cd60b2578f450cf79",
			pinata_secret_api_key:
			  "0071de8e6bb414b85d442cbb5b8286a94b093d150c676087974ef4eb903160d1",
		  },
		  data: data,
		}
		const res = await axios(config);
		const created = res.data.IpfsHash;
		const metadataURI = `https://ipfs.io/ipfs/${created}`;
		console.log("metadataURI",metadataURI)
		const mint = await MintNFT({metadataURI})
		console.log(mint)
	  }
	  
	const getStatus = async (callbackId: string) => {
		const response = await axios.get(statusUrl + `/${callbackId}`)
		setStatus(response.data.status)
	}

	const getCallback = async (input: Inputs) => {
		const params = {
			hackathonname: input.hackathonname,
			teamname: input.teamname,
			email: input.email,
			repo: extractGitHubRepoPath(input.repoLink),
			presentationlink: input.presentationlink,
		}
		return toast.promise(
			axios.get(getCallbackUrl + '/repo', {
				params,
			}),
			{
				loading: 'Loading..',
				error: (error) => handleError(error),
				success: 'Success',
			}
		)
	}

	const proveIt = async (input: Inputs) => {
		const response = await getCallback(input)
		if (response.status !== 200) {
			throw new Error('Something went wrong')
		}
		setCallbackId(response.data.callbackId)
		setAppUrl(response.data.url)
	}

	
	let isFetchCalled = false;
	
	useEffect(() => {
		const fetchData = async () => {
		  const response = await fetch(fetchdata + '/data');
		  const data = await response.json();
		  if (data.length > 0) {
			const lastResponse = data.slice(-1)[0];
			console.log("lastresponse", lastResponse);
			SetResponse(lastResponse);
		  }
		};
		fetchData();
	}, []);

	
	useEffect(() => {
		
		if (!callbackId) return
		const interval = setInterval(() => {
			getStatus(callbackId)
		}, 2000)
		return () => clearInterval(interval)
		
	}, [callbackId])

	return (
		<div className="flex min-h-screen items-center w-full h-full max-w-90% lg:max-w-[70%] mx-auto justify-between gap-36 lg:gap-20 flex-col lg:flex-row flex-wrap  max-w-full p-2 lg:p-10 py-10">
			<div className="flex flex-col items-center justify-center pt-16 max-w-full m-auto text-center lg:text-start lg:items-start">
				<div className="mb-12">
					<h3 className="text-xl font-Fredoka text-white text-opacity-70">
						Claim your identity or proof of work that you <br/> build on the Hackathon.{' '}
					</h3>
				</div>

				{status === 'verified' ? (
					<div className="mb-12">
						<h3 className="text-3xl font-bold text-yellow">
							<span className="opacity-100">🚀</span> Thanks for verification{' '}
							<span className="opacity-100">🚀</span>
							<div className='flex justify-between'>
								<p></p>
							<button onClick={mintcerti} className='btn-grad  text-lg'>Mint your NFT</button>
							<p></p>
							</div>
						</h3>
					</div>
				  ) : appUrl && callbackId ? (
				 	<QrMessage appUrl={appUrl} />
				 ) : (
				 	<Form proveIt={proveIt} />
				 )} 
			</div>

			<div className="max-w-[50%] m-auto">
				<img src={Device} alt="" />
				<button onClick={mintcerti} className='btn-grad  text-lg'>Mint your NFT</button>
			</div>
		</div>
	)
}
