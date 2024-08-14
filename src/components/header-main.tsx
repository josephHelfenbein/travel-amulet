import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { Router, useRouter } from 'next/router';
import React from 'react';
import styles from './login-form.module.css';

class Dropdown extends React.Component{
    state = {
        isOpen: false
      };
      toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });
      render() {
        const menuClass = `dropdown-menu${this.state.isOpen ? " show" : ""}`;
        return (
          <div className="dropdown" onClick={this.toggleOpen}>
            <a
              className="dropdown-toggle"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
            >
                <svg  xmlns="http://www.w3.org/2000/svg" width="38px" height="38px" fill='white' viewBox="0 -960 960 960">
                <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"></path>
                </svg>
            </a>
            <div style={{left:-110}} className={menuClass} aria-labelledby="dropdownMenuButton">
                <a className={styles.dropdownIcon+" dropdown-item"} type="button" href="./account">
                <svg className="p-1" xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" fill="#505050">
                    <path d="M400-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM80-160v-112q0-33 17-62t47-44q51-26 115-44t141-18h14q6 0 12 2-8 18-13.5 37.5T404-360h-4q-71 0-127.5 18T180-306q-9 5-14.5 14t-5.5 20v32h252q6 21 16 41.5t22 38.5H80Zm560 40-12-60q-12-5-22.5-10.5T584-204l-58 18-40-68 46-40q-2-14-2-26t2-26l-46-40 40-68 58 18q11-8 21.5-13.5T628-460l12-60h80l12 60q12 5 22.5 11t21.5 15l58-20 40 70-46 40q2 12 2 25t-2 25l46 40-40 68-58-18q-11 8-21.5 13.5T732-180l-12 60h-80Zm40-120q33 0 56.5-23.5T760-320q0-33-23.5-56.5T680-400q-33 0-56.5 23.5T600-320q0 33 23.5 56.5T680-240ZM400-560q33 0 56.5-23.5T480-640q0-33-23.5-56.5T400-720q-33 0-56.5 23.5T320-640q0 33 23.5 56.5T400-560Zm0-80Zm12 400Z"></path>
                </svg>Account</a>
                <button className={styles.dropdownIcon+" dropdown-item"} type="button" onClick={
                    async () => {
                        await signOut(
                            {
                                callbackUrl: `/login`,
                                redirect:true,
                            })
                }}><svg className="p-1" xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" fill="#505050">
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"></path>
                </svg>Sign Out</button>
            </div>
          </div>
        );
      }
}
export default function HeaderMain(){
    const [login, setLogin] = useState(true);
    const {status} = useSession({
        required:true,
        onUnauthenticated() {
            setLogin(false);
        },
    });
    const [onMobile, setOnMobile] = useState(false);
    useEffect(()=>{if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        setOnMobile(true);
    }}, []);
    return (
        <nav className={styles.mainHeaderWeb_index+' navbar'}>
        <div className="container-fluid">
            <a className="navbar-brand p-2" href="/">
                {onMobile && 
                    <img width="150" src='/header-logo-white.svg' />
                }
                {!onMobile && 
                    <img width="250" src='/header-logo-white.svg' />
                }
            </a>
                {!login &&
                    <form className='d-flex'>
                    <a href="./login"><button className={'btn btn-outline-light m-1'} type="button">Login</button></a>
                    <a href="./signup"><button className={'btn btn-outline-light m-1'} type="button">Sign Up</button></a>
                    </form>
                }
                {login &&
                    
                        <div className='dropdown d-flex'>
                            <Dropdown />
                        </div>

                }
        </div>
        </nav>
    ); 
}