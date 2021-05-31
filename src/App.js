import './App.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import {Helmet} from 'react-helmet';
import {useEffect, useRef, useState} from "react"
import {storage,fire} from "./base"
import Slider from "react-slick";
function App() {
    const [url, setUrl]=useState(null)
	const [image, setImage]=useState(null)
	const nameRef = useRef(null)
    const textAreaRef = useRef(null)
    const emailRef = useRef(null)

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
			const check=file.name.match(/\.(jpg|jpeg|png|gif)$/)
			if(check)
			{
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
				res&&upDatabase(nameRef.current.value,textAreaRef.current.value,emailRef.current.value,res)
				//hidden()
			}
		)
	}
    const upDatabase=async(name,des,email,link)=>{
		await fire.firestore().collection('Image').add({
			name:name,
            des:des,
            email:email,
			link:link
		})
        nameRef.current.value=''
        textAreaRef.current.value = ''
        emailRef.current.value = ''
		setList([])
		fetch()
	}
    const settings = {
        dots: true,
        infinite: true,
        speed: 2000,
        autoplay:true,
        arrows:false,
        autoplaySpeed:2000,
        slidesToShow: 1,
        slidesToScroll: 1
      };

  return (
    <div className="App"> 
      <h1>Upload Image</h1>
    <hr/>
    <div className="from">
        <div className="wrap_from" >
            <div className="from_group">
                <label htmlFor="name">Image Title</label>
                <input type="text" placeholder="Name"
                     required  ref={nameRef}/>
            </div> 
            <div className="from_group">
                <label htmlFor="des">Image Description</label>
                <textarea rows="2"
                          placeholder="Description" required ref={textAreaRef}>
                </textarea>
            </div>
            <div className="from_group">
                <label htmlFor="email">Email</label>
                <input type="text" placeholder="Email"
                     required  ref={emailRef}/>
            </div> 
            <div className="from_group">
                <label htmlFor="image">Upload Image</label>
                <input type="file"  onChange={onChangeImage}/>
            </div>
            <div className="from_group">
                <button type="submit" onClick={upLoad}>Submit</button>
            </div>
        </div>
    </div>
    <hr/>
    <div>
        <h2> Slide Show</h2>
        {list.length>0&&(
        <Slider {...settings}>
           {
                list.map((e,i)=>  (
                    <div key={i} className="slider_items">
                        <img src={e.link}/>
                    </div>
                   
                )
                )
           }
        </Slider>
        )}
      </div>
    <hr style={{margin:"40px 0"}}/>
     
      {list.length>0&&(
           <div className="row">
            {
                list.map((e,i)=>(
                    <div key={i} className="column" style={{margin:'15px 10px'}}>
                        <img  src={e.link} style={{width:"300px", height:"300px", borderRadius:"30px"}}/>
                        <h5 style={{textAlign:"center"}}>{e.name}</h5>
                        <p style={{textAlign:"center"}}>{e.des}</p>
                    </div>
                ))
            }
          </div>
      )}
 </div>)
}

export default App;
