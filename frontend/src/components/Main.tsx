import axios from 'axios'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { extractGitHubRepoPath, handleError } from '../utils'
import Form, { Inputs } from './Form'
import QrMessage from './QrMessage'
import Device from '.././assets/Device.svg'
import Logo from '.././assets/logo.png'

const getCallbackUrl = process.env.REACT_APP_BACKEND_BASE_URL + '/home'
const statusUrl = process.env.REACT_APP_BACKEND_BASE_URL + '/status'
const fetchdata = process.env.REACT_APP_BACKEND_BASE_URL

export default function Main() {
	const [callbackId, setCallbackId] = useState<string | null>(null)
	const [status, setStatus] = useState<string | null>(null)
	const [appUrl, setAppUrl] = useState<string | null>(null)
	

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

	const fetchs = async ()=>{
		
		fetch(fetchdata + '/data')
		.then(response => response.json())
		.then((data) => {
			console.log("emptydata",data)
		if (data.length > 0) {
		const lastResponse = data.slice(-1)[0];
				  console.log("lastresponse",lastResponse)
				}})
		.catch(error => console.error(error));
	}
	fetchs()
	
	useEffect(() => {
		
		if (!callbackId) return
		const interval = setInterval(() => {
			getStatus(callbackId)
		}, 2000)
		return () => clearInterval(interval)
		
	}, [callbackId])

	return (
		<div className="flex min-h-screen items-center w-full h-full max-w-90% lg:max-w-[70%] mx-auto justify-between gap-36 lg:gap-20 flex-col lg:flex-row flex-wrap  max-w-full p-2 lg:p-10 py-10">
			<div className="flex flex-col items-center justify-center pt-10 max-w-full m-auto text-center lg:text-start lg:items-start">
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
			</div>
		</div>
	)
}
