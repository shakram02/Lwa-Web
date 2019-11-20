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

## Usage

1. Download the repo
2. Run `npm install`
3. Run `node lwa-web.js` ( the dependencies of the webpage are downloaded in the `/public` folder.) `npm install` is needed to run `lwa-web.js`

4. Install the android application [here](https://github.com/shakram02/Lwa-Mobile)
5. Upload the Firmata sketch to Arduino [sketch repo](https://github.com/shakram02/Lwa-Arduino)

## Cool people and cool libraries

- [@yeojz](https://github.com/yeojz) for [OTPlib](https://github.com/yeojz/otplib)
- [@rwaldron](https://github.com/rwaldron) for [Jhonny-Five](https://github.com/rwaldron/johnny-five)
