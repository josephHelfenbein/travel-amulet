import { kStringMaxLength } from 'buffer';
import styles from './login-form.module.css';
import {useEffect, useState} from 'react';




const SignUpForm = () => {
    const [txt, setTxt] = useState("");
    const http = require('https');
    const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

    const options = {
        method: 'GET',
        hostname: 'countrywise.p.rapidapi.com',
        port: null,
        path: '/?country=all&fields=iso.alpha_2%2Cflag.emoji%2Cname',
        headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': 'countrywise.p.rapidapi.com'
        }
    };

    const req = http.request(options, function (res) {
        
        const chunks:any[] = [];

        res.on('data', function (chunk) {
            chunks.push(chunk);
        });

        res.on('end', function () {
            const body = Buffer.concat(chunks);
            const stringData:string = body.toString();
            const emoji = stringData.match(/\p{Emoji}+/gu);
            let i=1;
            let codes = [];
            let names = [];
            let k=1;
            while(i<stringData.length){
                if(stringData.substring(i, i+5) == "alpha"){
                    codes.push(stringData.substring(i+10, i+12));
                    i+=12;
                }
                else if(stringData.substring(i, i+4) == "name"){
                    let end = 0;
                    while(stringData.substring(i+7+end, i+7+end+1)!='"'){
                        end++;
                    }
                    names.push(stringData.substring(i+7, i+7+end));
                    i+=7+end+1;
                }
                else i++;
            }
            let markup = "<option selected disabled value=''>Country...</option>";
            for(let j=0;j<codes.length;j++){
                markup+="<option value='"+codes[j]+"'>"+names[j]+" "+emoji[2*j+1]+"</option>";
            }
            setTxt(() => markup);
        });
    });
    
    req.end();
    return (<div className={styles.login_box + ' card p-5 '}>
        <h1 className="display-6 mb-3">Sign Up</h1>

                <div className="form-floating mb-3">
                    <input className="form-control" id="name" name="name" placeholder="Name" required/>
                    <label htmlFor="name">Name</label>
                </div>
                <div className='mb-3'>
                    <select dangerouslySetInnerHTML={{__html: txt}} className="form-select" id="country">
                    </select>
                
                </div>
                <div className="form-floating mb-3">
                    <input className="form-control" id="username" name="username" placeholder="Email" type="email" aria-describedby="usernameHelp" required/>
                    <label htmlFor="username">Email</label>
                </div>
                <div className="form-floating mb-3">
                    <input className="form-control" type="password" id="password" name="password" placeholder="Password" required/>
                    <label htmlFor="password">Password</label>
                </div>
                
                <div className='row g-3'>
                    <div className='col-md-8'>
                        <button type="submit" className="btn btn-primary">Sign Up</button>
                    </div>
                    <div className='col-md-4'>
                        <a href='./login'>Login</a>
                    </div> 
                </div>
        
    </div>);
}

export default SignUpForm;