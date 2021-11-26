// const router = require('express').Router()

// router.get('/', (req, res) => {
//   res.status(200).json({ msg: 'hello' })
// })

// module.exports = router

const router = require('express').Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  const response = await axios.get("https://sheets.googleapis.com/v4/spreadsheets/19cTe7BX2O1z9NwgT8zNEkkwNvgAx26EiHZuaTU31VUU/values/A:Z?key=AIzaSyAkUHYGwbAVsfMFix4FLmBYRC_0lzcSJ1I");
  res.status(200).json(response.data);
});

module.exports = router;
