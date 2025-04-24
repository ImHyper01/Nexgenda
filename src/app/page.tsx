import React from "react";
import Header from '../components/header';
import Landing from '../components/Landing';
import Benefits from '../components/Benefits';
import Price from '../components/Price';
import Users from '../components/Users';
import Usp from '../components/Usp';
import Footer from '../components/Footer';

export default function index() {

  return (
    <div>
      <Header />
      <Landing />
      <Benefits />
      <Price />
      <Users />
      <Usp />
      <Footer />
   </div>
  )
}