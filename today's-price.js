

const cheerio = require('cheerio')
const fetch = require('node-fetch')

const FLIPCART_URL = 'https://www.flipkart.com/apple-2020-macbook-air-m1-8-gb-256-gb-ssd-mac-os-big-sur-mgn63hn-a/p/itmde54f026889ce'
const EXPECTED_AMOUNT = 82000

const convertPrice = (amount) => parseInt(Number(amount.replace(/[^0-9.-]+/g, "")));

 var getHtml = async url =>{
  const headers = {
    method: 'get',
    header: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    }
  }
   const res = await fetch(url)
   const html = await res.text()
   return cheerio.load(html)

 }
 const checkFlipkartPrice = async (url, expected_price) => {
  const $_parsed_html = await getHtml(url)
  const price = $_parsed_html('div').find('._16Jk6d').text()//fetch price

  const name = $_parsed_html('.yhB1nd').find('.B_NuCI').text() //fetch product name

  var priceInt = convertPrice(price) //convert price to INT
   
  if(priceInt <= expected_price){
    sendPush(priceInt, name) //send push notification to devices
    console.log("Yeyy..., Price went down push send to devices,check your mobile/PC")
    
  }else{
    console.log('No hope this hour, actively scanning for changes')
  }
 }
 const sendPush = async (price, name) =>{

  const notifyChannelId = 'CVVI2GRvYsusu8L484Hq'
  const dataString = `Price went Down : ${name} went below ${price} `
  var headers = {
    method: 'POST',
    body: dataString,
    headers : {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'

    }
  }
  const res = await fetch(`https://notify.run/${notifyChannelId}`,headers)
  return true
 }
 checkFlipkartPrice(FLIPCART_URL,EXPECTED_AMOUNT)