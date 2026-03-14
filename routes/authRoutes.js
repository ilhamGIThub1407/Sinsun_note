const router = require('express').Router()
const authController = require('../controllers/authControllers')
const middleware = require('../middlewares/middleware')

router.post('/api/login', authController.login)
router.post('/api/news/writer/add',middleware.auth,middleware.role, authController.add_writer)

router.get('/api/news/writers',middleware.auth,middleware.role, authController.get_writers)
router.get('/api/news/writer/:writer_id',middleware.auth,middleware.role, authController.get_single_writer)
router.delete('/api/news/writer/delete/:writer_id',middleware.auth,middleware.role, authController.delete_writer)

module.exports = router