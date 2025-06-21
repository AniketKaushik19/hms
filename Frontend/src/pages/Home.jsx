import React from 'react'
import { Header } from '../components/Header'
import { SpecialityMenu } from '../components/SpecialityMenu'
import { TopDoctor } from '../components/TopDoctor'
import { Banner } from '../components/Banner'
export const Home = () => {
  return (
    <>
        <Header/>
        <SpecialityMenu/>
        <TopDoctor/>
        <Banner/>
    </>
  )
}
