"use client"
import React, { useContext, useEffect, useState } from 'react'
import {
  deleteRestaurant,

  logout,
  updateBackground,
  updateProfile,
  updateRestaurant
} from '../../../app/api/services/restaurant.service'

import { useRouter } from 'next/navigation'


import LoadComponent from '../../../components/utils/load.component'

import { LateralNavControl} from '../../../components/controls/menu.nav.control'
import { EditImageInput } from '../../../components/inputs/edit.image.input'
import { EditTextInput } from '../../../components/inputs/edit.text.input'
import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css';
import { SelectDiv } from '../../../components/utils/select.div'
import { ChangePasswordForm } from '../../../components/forms/change.password.form'

import DeleteIcon from '@mui/icons-material/Delete';
import includeZero from '../../../core/utils/include.zero'
import DeleteForm from '../../../components/forms/delete.form'

import { PalleteForm } from '../../../components/forms/pallete.form'
import { AuthContext } from '../../../context/auth.context'
import { PalleteContext } from '../../../context/pallete.context'
export default function Page() {

  const router = useRouter()

  const { restaurant, refreshRestaurant, isMe } = useContext(AuthContext)

  const [load, setLoad] = useState<boolean>(true)

  const [name, setName] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [resume, setResume] = useState<string | undefined>();

  const [profile, setProfile] = useState<File | null>(null);
  const [background, setBackground] = useState<File | null>(null);
  const [staticDate, setStaticDate] = useState<Date>(new Date());

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

  const { mirrorPallete } = useContext(PalleteContext)
  const updateImagesCallback = async () => {
    try {

      if (profile) {

        await updateProfile(profile)

      }
      if (background) {
        await updateBackground(background)
      }

      toast.success("imagem atualizada!")

    } catch (err: any) {
      toast.error(`Erro ao atualizar imagem: ${err.response.data.message}`)

    } finally {
      setProfile(null)
      setBackground(null)

    }
  }
  const updateRestaurantCallback = async () => {

    const objectUpdate = {
      name: name != restaurant?.name ? name : undefined,
      email: email != restaurant?.email ? email : undefined,
      resume: resume != restaurant?.resume ? resume : undefined,

    }

    try {

      if (objectUpdate.name || objectUpdate.email || objectUpdate.resume) {

        const res = await updateRestaurant(objectUpdate)

        toast.success(res?.data.message)
        if (refreshRestaurant)
          refreshRestaurant()
      }


    } catch (err: any) {
      toast.error(`Erro ao atualizar: ${err.response.data.message}`)

      setName(restaurant?.name)
      setResume(restaurant?.resume)
      setEmail(restaurant?.email)
    }

  }
  const deleteRestaurantCallback = async () => {

    try {

      await deleteRestaurant()
      await logout();
      router.push('/')

    } catch (err: any) {
      toast.error(`Erro : ${err.response.data.message}`)


    }

  }

  useEffect(() => {
    if (refreshRestaurant) {
      refreshRestaurant().then(() => setLoad(false))

    }
  }, [refreshRestaurant])



  return (
    <div style={{ background: mirrorPallete?.main || "#ffedd5" }} className="bg-orange-100 min-h-screen w-full">

      <ToastContainer />
      {load && <LoadComponent />}
      {isMe && <LateralNavControl editMode={true}/>}
      <DeleteForm
        message={'deseja mesmo deletar sua conta?(todos seus pratos serão deletados!)'}
        setOpen={setOpenDeleteModal}
        callback={deleteRestaurantCallback}
        open={openDeleteModal} />
      <div style={{ background: mirrorPallete?.primary || "#f97316" }} className=" py-6  relative">
        <div className="container mx-auto px-4">
          <div className="sm:flex-row flex-col justify-center items-center px-2 pt-2 ">
            <EditImageInput
              modePreview='background'
              imageState={{ image: background, setImage: setBackground }}
              default={restaurant?.background}
              callback={updateImagesCallback}

            />


            <EditImageInput
              modePreview='profile'
              imageState={{ image: profile, setImage: setProfile }}
              default={restaurant?.profile}
              callback={updateImagesCallback}

            />

            <div style={{color:mirrorPallete?.font||'#fff'}} className="ml-6 z-20">
              <h1 className="text-3xl font-bold"> <EditTextInput
                default={restaurant?.name}
                valueState={{ value: name, setValue: setName }}

                callback={updateRestaurantCallback}
              /></h1>

              <span className=' block'><EditTextInput
                default={restaurant?.email}
                valueState={{ value: email, setValue: setEmail }}
                callback={updateRestaurantCallback}

              /></span>

              <span className="block mt-2 w-[60%] text-sm">
                <EditTextInput default={restaurant?.resume || 'sem descrição'}
                  valueState={{ value: resume, setValue: setResume }}
                  mode='text-area'
                  max={300}
                  callback={updateRestaurantCallback}

                /></span>

            </div>
          </div>
        </div>
      </div>

      <SelectDiv mode='edit' titles={['Mudar senha', 'Paleta de cores', 'Configurações da conta']}>


        <div>
          <div className='w-[90%] min-h-10 m-auto bg-[#0000000f] rounded-lg p-4 shadow-lg'>
            <h2 className=' text-xl font-bold'>Mudar senha</h2>
            <ChangePasswordForm />
          </div>

        </div>

        <div>
          <div className='w-[90%] min-h-10 m-auto bg-[#0000000f] rounded-lg p-4 shadow-lg'>
            <h2 className=' text-xl font-bold'>Paleta de cores</h2>

            <PalleteForm />
          </div>
        </div>

        <div>
          <div className='w-[90%] min-h-10 m-auto bg-[#0000000f] rounded-lg p-4 shadow-lg'>
            <h2 className=' text-xl font-bold'>Resumo da conta</h2>
            <ul>

              <li><b>Tipo de usuário: </b>{restaurant?.rule}</li>
              <li><b>registrado desde: </b> {includeZero(staticDate.getDate())}/{includeZero(staticDate.getMonth() + 1)}/{staticDate.getFullYear()}</li>
            </ul>


            <button onClick={() => setOpenDeleteModal(true)} className='flex justify-center items-center my-2 p-2 bg-red-400 rounded-lg font-bold transition-all duration-300 hover:bg-red-500 hover:text-white'><DeleteIcon /> Deletar conta</button>

          </div>
        </div>


      </SelectDiv>

    </div>
  )
}
