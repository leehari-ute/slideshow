import './App.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import {useEffect, useRef, useState} from "react"
import {storage,fire} from "./base"
import Slider from "react-slick";
function App() {

    const [url,setUrl]=useState(null)
	const [image,setImage]=useState(null)
	const nameRef = useRef("")
    const textAreaRef = useRef("")
    const imgRef = useRef("")

    const [list,setList]=useState([])
	const fetch=async()=>{
		const resArr=[]
		await fire.firestore().collection('Image').get().then(res=>{
			const docs=res.docs
			docs.forEach(e=>resArr.push(e.data()))
		})
		setList(resArr)
		}
	useEffect(()=>{
		
		fetch()
		
	},[])
    const onChangeImage= (e)=>{
		if(e.target.files&&e.target.files[0])
		{
			const file=e.target.files[0]
            console.log(file)
			const check=file.name.match(/\.(jpg|jpeg|png|gif)$/)
			if(check)
			{
                console.log(check)
				setImage(file)
				setUrl(URL.createObjectURL(file))
                
			}
		}
	} 
	const upLoad=()=>{
		if(image===null)
		{
			return;
		}
		const updateTask= storage.ref(`images/${image.name}`).put(image)
		updateTask.on(
			"state_changed",snapshot=>{},
			error=> console.log(error),
			async ()=>{
				const res=await storage.ref("images").child(image.name).getDownloadURL()
				console.log(res)
				res&&upDatabase(nameRef.current.value,textAreaRef.current.value,res)
				//hidden()
			}
		)
	}
    const upDatabase=async(name,des,link)=>{
		await fire.firestore().collection('Image').add({
			name:name,
            des:des,
			link:link
		})
		//setList([])
		//fetch()
	}
    const settings = {
        dots: true,
        infinite: true,
        speed: 2000,
        autoplay:true  ,
        autoplaySpeed:2000,
        slidesToShow: 1,
        slidesToScroll: 1
      };

  return (
    <div className="App">
      <h1>Upload Image</h1>
    <hr/>
    <div>
        <form>
            <div>
                <button type="submit">Slide</button>
            </div>
        </form>
        
        <div >
            <div>
                <label htmlFor="name">Image Title</label>
                <input type="text" placeholder="Name"
                       value={nameRef?nameRef.current.value:''} required  ref={nameRef}/>
            </div> 
            <div>
                <label htmlFor="des">Image Description</label>
                <textarea value={textAreaRef?textAreaRef.current.value:''} rows="2"
                          placeholder="Description" required ref={textAreaRef}>
                </textarea>
            </div>
            <div>
                <label htmlFor="image">Upload Image</label>
                <input type="file"  onChange={onChangeImage}  value={imgRef?imgRef.current.value:''} ref={imgRef}/>
            </div>
            <div>
                <button type="submit" onClick={()=>upLoad()}>Submit</button>
            </div>
        </div>
    </div>
    <hr/>
    <div>
        <h2> Single Item</h2>
        {list.length>0&&(
        <Slider {...settings}>
           {
                list.map((e)=>  (
                    <div className="slider_items">
                        <img src={e.link}/>
                    </div>
                   
                )
                )
           }
        </Slider>
        )}
      </div>
 </div>)
}

export default App;
