import React from 'react';
import './Footer.scss';
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className='footer footer-wrapper'>
      <ul className='footer__list'>
        <li className='footer__list-item'>
            <Link to='' className='footer__list-link'>Privacy</Link>
        </li>
        <li className='footer__list-item'>
            <Link to='' className='footer__list-link'>Terms</Link>
        </li>
        <li className='footer__list-item'>
            <Link to='' className='footer__list-link'>Advertising</Link>
        </li>
        <li className='footer__list-item'>
            <Link to='' className='footer__list-link'>Cookies</Link>
        </li>
        <li className='footer__list-item'>
            <Link to='' className='footer__list-link'>More</Link>
        </li>
        <li className='footer__list-item'>
            <Link to='' className='footer__list-link'>Meta © 2024</Link>
        </li>
      </ul>
    </footer>
  )
}

export default Footer
