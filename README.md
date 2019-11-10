# Lwa-Web
Website for Lwa (Lock with Authenticator). Prototypical Amazon Key-ish thingy. 

:point_down::point_down::point_down:

:boom::boom: **[Demo video](https://youtu.be/8U2EYIBWeYw)** :boom::boom:

This is a *fun project* and **production considerations weren't put in mind.** 

Lwa is simply an One Time Password (OTP) controlled embedded system actuator, think like getting a ticket to enter the roller coaster, you use the ticket only once, and it's valid for a limited amount of time.

It's divided into 3 parts:

1. Arduino sketch (defacto Firmata sketch)
2. Android application to generate OTP passcodes
3. Web portal to enter the passcode.

## Use case
Ideally, you have a network at home (you should get one if you don't). Let's say that you want to grant one of your friends the magnificent glory to light your room's lights over the internet. Because your room's light is so precious and needs to be secure, your friend can only light it once and before 30 secs. pass after you given them the code.

Only you have the secret token that's used to generate OTP keys. You generate the OTP key using the Android app and send the key to your friend. Your friend enters the key on the webportal (after you've removed the *Get Secret* page) and verifies the token, voila!!! your room lights will now be on.

## Usage

1. Download the repo
2. Run `npm install`
3. Run `node lwa-web.js` ( the dependencies of the webpage are downloaded in the `/public` folder.) `npm install` is needed to run `lwa-web.js`

4. Install the android application [here](https://github.com/shakram02/Lwa-Mobile)
5. Upload the Firmata sketch to Arduino [sketch repo](https://github.com/shakram02/Lwa-Arduino)

## Cool people and cool libraries

- [@yeojz](https://github.com/yeojz) for OTPlib [OTP](https://github.com/yeojz/otplib)
- [@rwaldron](https://github.com/rwaldron) for Jhonny-Five [High five](https://github.com/rwaldron/johnny-five)
