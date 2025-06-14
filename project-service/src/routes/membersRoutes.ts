import express, { Router } from 'express'
import { getMemberByProject, getMembersByProject, joinProject } from '../controllers/membersControllers'

const memberRouter: Router = express.Router()

memberRouter.post('/join', joinProject)
memberRouter.get("/:projectId/:userId", getMemberByProject)
memberRouter.get('/:projectId', getMembersByProject)

export default memberRouter