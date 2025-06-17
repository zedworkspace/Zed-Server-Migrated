import express, { Router } from 'express'
import { createChannel, getChannelById, getChannelByProjectId } from '../controllers/channelController'
import { userAuth } from '../middlewares/userAuth'

const channelRouter: Router = express.Router()

channelRouter.post('/',userAuth,createChannel)
channelRouter.get('/:projectId',userAuth,getChannelByProjectId)
channelRouter.get('/:projectId/:channelId',userAuth,getChannelById)

export default channelRouter