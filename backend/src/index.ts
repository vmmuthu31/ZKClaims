import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import { Reclaim, generateUuid } from '@reclaimprotocol/reclaim-sdk'
import cors from 'cors'
import { MongoClient } from 'mongodb';

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 8000
const callbackUrl = process.env.CALLBACK_URL! + '/' + 'callback/'
const linksCollectionName = 'submitted_links';
app.use(express.json())
app.use(cors())

const dbName = "zkclaims";
let linksCollection: any;
const client = new MongoClient("mongodb+srv://admin:admin@cluster0.rxnpu.mongodb.net/zkclaims");
const getLinksCollection = async (): Promise<any> => {
	if (!linksCollection) {
	  await client.connect();
	  const db = client.db(dbName);
	  linksCollection = db.collection(linksCollectionName);
	}
	return linksCollection;
  };



const reclaim = new Reclaim(callbackUrl)

const isValidRepo = (repoStr: string) => {
	return repoStr.indexOf('/') > -1 && repoStr.split('/').length === 2
}

app.get('/home/repo', async (req: Request, res: Response) => {
	const { hackathonname, teamname, repo, email,presentationlink } = req.query
	if (!repo || !email) {
		res.status(400).send(`400 - Bad Request: repo and email are required`)
		return
	}
	const repoFullName = repo as string
	const emailStr = email as string
	const hackathon = hackathonname as string
	const team = teamname as string
	const presentation = presentationlink as string

	if (!isValidRepo(repoFullName)) {
		res.status(400).send(`400 - Bad Request: invalid repository name`)
		return
	}

	const callbackId = 'repo-' + generateUuid()
	const template = (
		await reclaim.connect('ZKClaim', [
			{
				provider: 'github-contributor',
				params: {
					repo: repoFullName,
				},
			},
		])
	).generateTemplate(callbackId)
	const url = template.url
	const templateId = template.id

	try {
		const linksCollection = await getLinksCollection();
		await linksCollection.insertOne({
			callback_id: callbackId,
			status: 'pending',
			hackathonname: hackathon,
			teamname: team,
			email: emailStr,
			repo: repoFullName,
			presentationlink: presentation,
			template_id: templateId,
		})
	} catch (e) {
		res.status(400).send(`500 - Internal Server Error - ${e}`)
		return
	}

	res.json({ url, callbackId })
})

app.get('/status/:callbackId', async (req: Request, res: Response) => {
	let status

	if (!req.params.callbackId) {
		res.status(400).send(`400 - Bad Request: callbackId is required`)
		return
	}

	const callbackId = req.params.callbackId

	try {
		const linksCollection = await getLinksCollection();
		const result = await linksCollection.findOne({ callback_id: callbackId });
		if (!result) {
			res.status(404).send(`404 - Not Found: callbackId not found`)
			return
		}
		status = result.status
	} catch (e) {
		res.status(500).send(`500 - Internal Server Error - ${e}`)
		return
	}

	res.json({ status })
})

app.use(express.text({ type: '*/*' }))

app.post('/callback/:id', async (req: Request, res: Response) => {
	if (!req.params.id) {
	  res.status(400).send(`400 - Bad Request: callbackId is required`);
	  return;
	}
  
	if (!req.body) {
	  res.status(400).send(`400 - Bad Request: body is required`);
	  return;
	}
  
	const reqBody = JSON.parse(decodeURIComponent(req.body));
  
	if (!reqBody.claims || !reqBody.claims.length) {
	  res.status(400).send(`400 - Bad Request: claims are required`);
	  return;
	}
  
	const callbackId = req.params.id;
  
	const claims = { claims: reqBody.claims };
  
	try {
	  const linksCollection = await getLinksCollection();
	  const submittedLink = await linksCollection.findOne({ callback_id: callbackId });
	  if (!submittedLink) {
		res.status(404).send(`404 - Not Found: callbackId not found`);
		return;
	  }
	  if (!submittedLink) {
		  res.status(404).send(`404 - Not Found: callbackId not found`);
		  return;
	  }
	  
	  const result = await linksCollection.updateOne(
		  { callback_id: callbackId },
		  { $set: { claims: claims, status: 'verified' } }
	  );
	  console.log(result)

	} catch (e) {
	  res.status(500).send(`500 - Internal Server Error - ${e}`);
	  return;
	}
  
	res.send(`<div
	  style="
		width: 100%;
		height: 100%;
		display: flex;
		text-align: center;
		justify-content: center;
		align-items: center;
	  "
	>
	  <h1>
		Submitted the Claims! Your'e eligible for Hackathon Submission.
	  </h1>
	</div>`);
  });

  app.get('/data', async (req, res) => {
	const linksCollection = await getLinksCollection();
	const data = await linksCollection.find().toArray();
	res.json(data);
  });
  

process.on('uncaughtException', function (err) {
	console.log('Caught exception: ', err)
})

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`)
})