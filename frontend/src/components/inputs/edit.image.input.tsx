import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { PalleteContext } from "../../context/pallete.context";
import { invertHexColor } from "../../core/utils/invert.hex";


export function EditImageInput(props: {
    callback: () => Promise<void>
    imageState: {
        image: File | null, setImage: Dispatch<SetStateAction<File | null>>
    },
    default?: string
    modePreview: 'profile' | 'background'
}) {

    const {pallete}= useContext(PalleteContext)
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const { setImage,image } = props.imageState
    const [id, setId] = useState<string>()
   

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.includes("image")) {
         
            setImage(file);
            const reader = new FileReader();
        
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
             
            };
            reader.readAsDataURL(file);



        } else if (file && !file?.type.includes("image")) {
            setPreviewImage('/invalid-image.jpg')
        }
        else {
            setImage(null)

        }
    }

    useEffect(()=>{
        if(image){
            props.callback()            
        }
    },[image])
    useMemo(()=>{
        setId(Math.random().toString(32).replace('0.', 'text-input-'))
    },[])
    return <>
        <input
            type="file"
            id={id}
            accept="image/*"
            onChange={handleImageChange}
            className=" hidden"
        />
        {props.modePreview == 'profile' ? <label htmlFor={id} style={{ borderColor: pallete?.primary || "#f97316" }}  className='block relative z-[2] md:w-56 w-[200px] rounded-full sm:border-4 border-2 h-[210px] m-auto sm:m-0 overflow-hidden'>

            <img className="transition-transform duration-300 relative w-full h-full m-auto sm:m-0 hover:scale-150 hover:cursor-pointer profile-input" src={previewImage || props.default || "https://cdn-icons-png.flaticon.com/512/433/433087.png"} alt="Restaurant" />
        </label> :
            <>
                <label htmlFor={id} style={{ background: pallete?.secondary || "#fdba76", color:pallete?.font||"#000" }}  className=" shadow-lg transition-all duration-300  absolute z-[2] top-0 right-0 p-1 rounded-lg opacity-10 hover:cursor-pointer hover:opacity-100" >
                    <EditIcon />
                </label>
                <img src={previewImage || props.default || "https://t3.ftcdn.net/jpg/05/79/48/54/360_F_579485400_8jSrBgNQP1BWUOjWujmRS79YJmzQv6fw.jpg"} alt="banner" className='absolute -top-[80%] sm:-top-[55%]  left-0 w-full h-[100%] z-[1]' />

            </>
        }


    </>
}