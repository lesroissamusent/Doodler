# Doodler

![Doodler - Screen Recording](https://user-images.githubusercontent.com/74684118/117976344-90d66c00-b327-11eb-8c63-c6902ec1a94b.gif)

Click [here](https://doodler.netlify.app/) to try the App!

## Table of contents: 
* [Brief](#brief)
* [Requirements](#requirements)
* [Timeframe](#timeframe)
* [Technologies Used](#technologies-used)
* [External React Component Used](#external-react-component-used)
* [Process](#process)
  * [Planning](#planning)
  * [My Focus](#my-focus)
  * [Styling](#styling)
  * [Challenges](#challenges)
  * [Wins](#wins)
* [Future Features](#future-features)
* [Key Learnings](#key-learnings)
* [Collaborators](#team)

## Brief:
The brief for this project was to work in a group (in our case 4 people) to build a full-stack application which used an Express API serving data from a Mongo database. This API needed to be consumed with a seperate front-end built with React. We were expected to have multiple relationships and CRUD functionality. 

### Requirements: 
1. A working app hosted on the internet
2. Full-stack application
3. Express API served from a Mongo db
4. Front-end built with React
5. Multiple relationships
6. CRUD functionality
7. Planning through wireframe/user stories/pseudo-code
8. Thoughtful design
9. Git repo hosted on GitHub with a readme.md file 
10. Deployed online

## Timeframe:
1 week

## Technologies Used:
MongoDB/Mongoose

Insomnia

Express

React.js - hooks

Node.js

SCSS

Bulma

Axios

Nodemon

Git/GitHub

## External React Component Used:
https://www.npmjs.com/package/react-canvas-draw

## Process
### Planning

I used the GoodNotes app on my iPad to draw up some wireframes based on an extensive planning session we had as a group.

<img width="598" alt="Screenshot 2021-05-11 at 17 52 15" src="https://user-images.githubusercontent.com/74684118/117969798-cb3c0b00-b31f-11eb-895a-05e5abdc1c64.png">
<img width="600" alt="Screenshot 2021-05-11 at 17 52 28" src="https://user-images.githubusercontent.com/74684118/117969805-cd9e6500-b31f-11eb-9b14-7a4f52bd9529.png">
<img width="598" alt="Screenshot 2021-05-11 at 17 53 10" src="https://user-images.githubusercontent.com/74684118/117969809-cecf9200-b31f-11eb-88d8-0a87fcb1b07e.png">
<img width="603" alt="Screenshot 2021-05-11 at 17 53 31" src="https://user-images.githubusercontent.com/74684118/117969820-d0995580-b31f-11eb-8142-1c65d1409520.png">
<img width="600" alt="Screenshot 2021-05-11 at 17 52 45" src="https://user-images.githubusercontent.com/74684118/117969816-d000bf00-b31f-11eb-9366-f2b9dfd52177.png">

### My Focus

Although everyone ended up working on everything in some ways, we definitely focused on specific areas. At the start of each day we would have a mini stand-up to see where each of us was most needed and whether anyone wanted help with anything. 

**Back-end**

In the first few days I concentrated on getting a back-end up and running so that we could get going on the front-end as well. 

The doodles were referred to as 'artworks' on the back-end

Artwork Schemas
```javascript
artworkSchema
  .virtual('avgRating')
  .get(function() {
    if (!this.comments.length) return 1
    const sum = this.comments.reduce((acc, curr) => {
      return acc + curr.rating
    }, 0)
    return sum / this.comments.length
  })

artworkSchema.set('toJSON', { virtuals: true })

export default mongoose.model('Artwork', artworkSchema)
```

Artwork Controllers
```javascript
export const getAllArtwork = async(req, res) => {
  const artwork = await Artwork.find().populate('owner')
  return res.status(200).json(artwork)
}
export const getOneArtwork = async (req, res) => {
  try {
    const { id } = req.params
    const singleArtwork = await Artwork.findById(id).populate('owner')
    if (!singleArtwork) {
      throw new Error('no artwork exists with that id')
    }
    return res.status(200).json(singleArtwork)
  } catch (err) {
    console.log('🆘 Something went wrong')
    console.log(err)
    return res.status(404).json({ 'message': 'Not found' })
  }
}
```
**Front-end**

My main focus on the front-end was The profile page. We had planned to have user info, user's doodles and favourited doodles here. At some point we decided that favourited doodles shouldn't appear on the profile, as we moved towards a rating system for the doodles instead of personal favouriting. 

![Doodler-profile copy](https://user-images.githubusercontent.com/74684118/118016526-68f9ff00-b34d-11eb-8a2f-21e9e963b92c.gif)


```javascript
useEffect(() => {
    getSingleUser()
    console.log('user ->', user)
    getAllArtwork()
  }, [location.pathname])

  const getSingleUser =  async () => {
    const response = await axios.get(`/api/users/${params.id}`)
    setUser(response.data)
  }

  const getAllArtwork = async () => {
    const response = await axios.get('/api/artwork')
    setAllArtwork(response.data)
  }

  useEffect(() => {
    if (!allArtwork) return null
    const userArtworkArray = allArtwork.filter(doodle => {
      return doodle.owner._id === params.id
    })
    setUserArtwork(userArtworkArray)
    console.log('🐝 ~ file: Profile.js ~ line 53 ~ userArtwork', userArtwork)

  }, [allArtwork])
  
  if (!user) return null
  if (!userArtwork) return null
  return (
```

The profile page also needed a profile form, so that the sign-up process didn't take too long (which I personally find annoying, especially when all you want to do is make some damned doodles!). Instead we decided to create a simple sign-up and then give the user the option to provide more information and pick a profile picture at a later time. 

```javascript
const ProfileForm = () => {

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    location: '',
    age: '',
    bio: '',
    profilePicture: ''
  })
  const [user, setUser] = useState(null)

  const params = useParams()
  console.log('params id', params.id)
  const history = useHistory()

  useEffect(() => {
    const getUserData = async () => {
      const response = await axios.get(`/api/users/${params.id}`)
      setUser(response.data)
      setFormData(response.data)
    }
    getUserData()
    console.log('get user ->', user)
  }, [])
```

We used Cloudinary to enable the user to be able to upload their own profile pictures. 

```javascript
const uploadUrl = process.env.REACT_APP_CLOUDINARY_URL
const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET


export const ImageUploadField = ({ handleImageUrl, value }) => {
  const handleUpload = async event => {
    const data = new FormData()
    data.append('file', event.target.files[0])
    data.append('upload_preset', uploadPreset)
    const res = await axios.post(uploadUrl, data)
    handleImageUrl(res.data.url)
    console.log('response', res)
  }
```

### Styling
* Styling was perhaps the only part of this project that we all worked on together equally. Although some minimal styling was done by us individually as we built components, the bulk of the CSS was written on our final day of the project, as a team effort, often with one person typing and everyone else following along on Zoom and VSCode.
* The idea from the beginning had always been a clean, almost gallery website-esque, look. We wanted to play with the idea that the doodles were artworks. 
* The Doodler title I made for our wireframes ended up looking like the perfect cross between a doodle and a font which was exactly what we wanted for our app, as a result I went back to GoodNotes to create titles for each page, images for the navbar as well as a logo. 
* Bulma was used sparingly, mainly to short-cut the amount of work needed for elements like buttons and navbar.

### Challenges
* One of the surprisingly tricky aspects of this project was getting used to using GitHub as a group and dealing with seperate branches and merge conflicts. This got easier for me every single day, the key really did turn out to be practice. 

### Wins
* The end product was something that we were all really proud of. I personally felt that we managed to do something really fun that can be enjoyed by lots of different people. 
* I'm really impressed with my group's ability to work together harmoniously. Especially as our first group project, on our most extensive project to date, with such varied mix of knowledge and skill. 

## Future Features
Some features we could have implemented with more time:
* Our wireframe included background images for users to doodle on top of, this could be easily added in the future. 
* Currently the carousel on the homepage displays some doodles we made and took screenshots of. We had wanted to have the highest rated doodles appear on the carousel, and change dynamically as users rated more doodles, but quickly realised that we wouldn't have enough time to do this well.

## Key Learnings
* Git & GitHub - This project definitely changed my comfort level in this area. I no longer feel like I might delete everything with every push. 
* Back-end - As my first project with a complete back-end, this experience really cemented my understanding of how important a detailed back-end can be to a clean fron-end. 

## Team
My brilliant teammates! Click to check out their work. 

[Sami Hakim](https://github.com/Hamisakim)

[Eric Petsopoulos](https://github.com/ericpesto)

[Ayo Olawoye](https://github.com/ayoolawoye)

