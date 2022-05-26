const canvas = document.getElementById("canvas0");
const context = canvas0.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];

const mouse = {
    x: null,
    y: null,
    r: 50
}

window.addEventListener("mousemove", function(e){
    mouse.x = e.x ; 
    mouse.y = e.y ;
});

function drawImage() {
    let img_width = png.width;
    let img_height = png.height;
    const draw_data = context.getImageData(0,0,img_width,img_height);

    

    class Particle {

        constructor(x, y, colour, r) {
            this.x = x + canvas.width/2 - img_width *2,
            this.y = y + canvas.height/2 - img_height *2,
            this.colour = colour,
            this.r = 2,
            this.xpos = x + canvas.width/2 - img_width *2,
            this.ypos = y + canvas.height/2 - img_height *2;
            this.weight = Math.random()*10 +2;
        }

        draw() {
            context.beginPath();
            context.arc(this.x,this.y,this.r,0,Math.PI *2);
            context.closePath();
            context.fill();
        }

        update() {
            
            context.fillStyle = this.colour;
            let xdist = mouse.x - this.x;
            let ydist = mouse.y - this.y;

            let dist = Math.sqrt(xdist*xdist + ydist*ydist);

            let force_prop_x = xdist/dist;
            let force_prop_y = ydist/dist;

            const maxDist = 100;
            let force = (maxDist - dist)/maxDist;
            if (force < 0) force = 0;

            let disp_x = force * force_prop_x * this.weight ;
            let disp_y = force * force_prop_y * this.weight ;
            //console.log(dist < 400);
            if(dist < mouse.r + this.r) {
                console.log(dist);
                this.x -= disp_x;
                this.y -= disp_y;
                
            } else {
                if (this.y !== this.ypos) {
                    let ret_disp_y = this.y - this.ypos;
                    this.y -= ret_disp_y/5;
                }
                if (this.x !== this.xpos) {
                    let ret_disp_x = this.x - this.xpos;
                    this.x -= ret_disp_x/5;
                }
            }
            this.draw();
        }
    }

    function init() {
        particleArray = [];

        for(let y = 0; y < draw_data.height; y++ ) {
            for(let x = 0; x < draw_data.width; x++) {
                if (draw_data.data[y * 4 * draw_data.width + x*4 + 3] > 128){
                    let position_x = x;
                    let position_y = y;
                    let colour = "rgb(" + draw_data.data[y * 4 * draw_data.width + x*4] + ","
                                    + draw_data.data[y * 4 * draw_data.width + x*4 + 1] + ","
                                    + draw_data.data[y * 4 * draw_data.width + x*4 + 2] + ")";
                    particleArray.push(new Particle(position_x*4, position_y*4, colour));
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        context.fillStyle = 'rgba(0,0,0,0.5)';
        context.fillRect(0,0,innerWidth,innerHeight);

        for (let i = 0; i < particleArray.length;i++){
            particleArray[i].update();
            //console.log(i);
        }

    }
    init();
    animate();

    window.addEventListener('resize', function() {
        canvas.width = this.innerWidth;
        canvas.height = this.innerHeight;
        init();
    });
}

const png = new Image();
png.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABgCAYAAADrc9dCAAAgAElEQVR4Xu19B3Rc9ZX+9970ptFoNOq9Wc2990azjcF0Q6gOJSQm/AmBECCBsPSYQEjoPfRgwAXcsInBHVfZalbvvY2ml/fefqMc8s9uls2eY8lWdplzdGzL0nuj33333u9+97tXAr5/jaoTEEbVu/n+zeB7g4yyh+B7g3xvkFF2AqPs7XzvId8bZJSdwCh7O997yPcGGd4TUE+6K6yRRdF37AkxcmUh7eaQ0vSyZnjvcvqu9r/SQ9SZF88L13/y9ek7xuG70/8Ogyx4UI2dD4a/61hycpboamo2B4bv2EbuSv8iBnmQ4ehBWTf5pp8HDr+yBud8EqczeDt1koiQHESUSodwWELv5qv/+c+TsyQKNZsHR+5IT+3K//wHOLXrD993595YgOpXK8SFL8iCI1FQqUVogwo0ggy9qIHMn8Q34FQGt/xgKJf8q75Gv0Fyr3gY1R/e/+0Ba5e8rQiJSRB47HpF4AeglQFJUOB3ueH3DMCz+br/8HNZL3jh1pDf+3zI7URo70Oj+mcevW8u98r3BcF4hVI1SMT0kaRa8ooi9QehibZCnZkFRS/CJKphUgtQ+8IQmEG8QS+N4oUc8kIKhxDQCRDUKqglHyQaS/a5EXIcUg8Z96OPpNHoRaPTILkrr4fK8goqX/kbfNWd86Ki2NOg8QahpCRhwQUTUXK0ih6i5ufCCLv8CAVD8AcCkMM0kI5eY1TBJwUg9tFr+nsBtxeK3z0G3voMlL617XuD/A9PQMi/TlYq3/pbLtDO/J2sNloFdeE4oG8QKpsVhoI46LUK4q1aBNv9cPcFEKRBgn4/GMkgmTWQTCqoghKc5VXw9/VACLig+FxP4cDDP/8fvpXT/mWj00OKr38EpW/ep5v8yDMqrf52TZQDlrgEhiARgj0eol+CaWIiVFoJDrsGJujQXTnAcBUg2lIQiniHSYAmSovehh4MltUAgwNQGLpEV+dD8oHHHkDxlTJK3x91AGD0GaRopSKoDYpS8oZomrVGUZmtiMkrwmB7K9RRURDHZEJkiNJmWhDjMCHOokJUrBZ9DV6019MgoTBko4AQvUMhAnM39WHgYCnzhwuCqxN6X1+S9/Az7UNVfdFKSSn7QHXa3eC/ueHoMkjhVb+FwfwEROFDHHxpsWneM0pUZg5iElL4pNdCtMZAzElF+vgEyIpMT1AhJRCCrcCIkFtGVQmTup/5RAsEzSoEA0F46rvRe7wKGOiDyt0MESpYArD2HXhwEBNXThF94R/LlWtXjRajjB6DFF0egmhnYpDuxsGXf6mZd89XWl2akjNvwXxVlB4dh09C5yDCyjVh5vn5aGv0waPXI9anIDlLhFkjorosiM4+GT5NGFKUGu5eL1x1TOjflCPk7YTkaYfIeCZIAmQ2S5V99wgYe30Qsud5lH30/0aDUUaFQdSFl84Na7QBGKIuwP4X71fN+TnDlgUGYzxyli2Fs74NktMDXaIV5mwLJpyTioEeBf1EWNYoBYUxfOoJcRuaBFQ2+eANywgy2Xu73Wg/UAvPyRYIISdRVjfk7T6GqAdZuQCaGY/Kof33imLRdb+WA7r9gGcdat41nknDjAqDoPByBZaoKTjw6mHM+7mi1loZ4A2wxjI8nTeHYacHvs4+mBKiYcm0YQoN4vSE4A5JSIwXcbZBA4H54nA3UNoVRD+RlUurgafTj5r1h6ByBRH290P5+Jp/+HnV0x5bFP7ml1+eSSP8/b3PvEEKLpGhMRAS6f+gMttuk3VGiCorBMWAKEcSCi+ZB09jNwbr+qCLN8GaFYdJix1QaJCgHEJ2kgGTGYAsrFj2DCoo6xbQz6q9LSxgsMWLqg1HIfT7IAQHWYN4oVIsxYIslSoqli0brmC2+etLO+XB4mDQXY/jazxn0jhn3iBEVVATp5a8JeDsXyuiLgoQiaYIZWNiHci/fBZCvR6MTYvDX/ZVIa7IgewCCyw2NTykTeK0IibwWHNUAspYsZf0C2hkYu+hgbpO+tG2vwmB+k6Eg04IfqaLkAg176fhhxIOhXyfruB3/5W8VE97cl1Y9m3GoQdeOlNGObMGyb9MRuVHIibf/AoOv3yTsOQRRW0iklJZIIp6mI02FF01DapAGE0HW6A3GRGTZUBSdgzio5m8/WqoY4F8QtypJESamDsqvEA1n/EWGqun1I3O2n4Emzrh7umCajAMWh+OpCS4I1SK14/ggG9scNvFpX8zwKxH+7H3Xtv/UYP8YCx06gP0jqFEqr3wd4pgjWM+MEBQGWBUmzDhysnQqxXUH2iBzmpBdIYBsakW2EwKOpslxKVrkBgNnKVXwcUapCEIVAQEfijoqwrA3TEIb+cgQcAgpDYnJHqRWm+ALso4ZBBpwA1PQDZpRckdXL9CxOwnd2PP3XP+bxokUpxNXKUoR18XMP+eK4321PekGDsjWDRpdR3UohH5i7MRl2REw4Ee6NL1cKRbUJymQy+r9bqTIcSnqxAXrcI5FjK/UhgtYRXKaZSjLhl9LUFIXX4M9vvRzbAXbhtAqNsFs83EKj4KCg0Y6PMgOOiErNbC987iMxsxIudxpp4EFFzK+LJWxKRbZ+DIC/sx7z5FbYyGNjcXWqMVKlELlWBEzrhk5Eywo3RHG5LnRiPdpkMUC8IW9kLqq0JwZKmQRNg7QS9jDMOWM0QPYZ444Ayj3xWGvkNCQ6+fFJgXoVYv80kPLDFW6Gz0QjLBYZ8fnh7S9pKEgHPgSPjdpZPP2JmcUYOQtoDauB4lr18cOQD1goeVMKFqzPjxEExRjGR6GKJtUIUELFiRgmO7e1E4z4Y0rQAfm1PV/RKa6/zIHm9APKn4bCObVVIIWRo1Oln4VdAY5UEVTG1hdDD79zndCNI4/upu3laNMdOS0dDshJcAwN9PQ9HAA729ivzKgr/yWzlXZKPmw9rTbZwz4yF5V9yDqg8fx8SbZRx9WcTcp2XsukMUzv29ohi0SJ41FXrCX2h1EBUNFpyVjNKSTuRPcSCVpGE/u1PlbSEM9vmRUWhADFu5k+z8nExikZB3IRFXOCTjS78MQ784FN5620NoODEAPXkwUS8ga0YKTlZ3wSuHEfIBfrcfLrcPvn8bL2DqI2/j4H3XnG5jRO53+g2StNyotifeI6ulsHz0tYeEOY9/BpV5mUpr3CvqVbOInRC/YAZi42PYWCJE1RIVJeogMaTEZViRwMq8I0iIWxNGbKwaNnqGQS1hVoIOtaTfu+gdg7KMpXo12kJEUaRKguTjmS5QvqOHRulCTFI0ZIMIj1VEkKhLpnf4CQJcNFbf6hQBU367Gofu+uP/DYP8p59SmPsHRdBGk0o3Q9CTqRX6oWIDqnjmRJi17PaxCo+KEhFWKYiKNkJPT+geUKOvI4AxOaTjCXEthjByEvXoZIVOZwBbUTxmAcmqEGL9CgZVWjjZQfSw+ajtl1Fd1YNuUvVBix5B3kMwamkQCX1uBd1XOU7/Q/p3Z3Lab26a/2jA89W9rAQB1YxnZCEqURAEC4QYfsh99IRuSHYHClcuQDSNYBVFZMSKqOjxItURBZdGxqBLhbx0NSZF8obCkC+wP8JWbhf/7oYESRYxGLEMi8MCDb2DeaiNIay6S4G5m9V9qh7tXV58Xc3c4Q9AT48JMvf0uInSPi/9CZ6f/bw48cmQfPRujSr96h9Ije+8e7q85fQbZPmLSmDA/aXslWYK5mSD3p7K8GFiQ4le0NcEk1mCJi8NtpwEJE9wIN6sYJJGh7dPdGNKth2drDEMpiDmO0i986CbaTA/bSIyd9SQLmmmR3gp8gk2+5BBRJaZr8J5ioIjlKUcbg1AzZxiYw7Kiwfe+aoaQbeGLWF6aEw0+liA1n1VC/nXY789l8ifClKuOK4SFafU9Oe5mtxrDoeq3x4xJHbaDWJc+TZp2gBCTgoW4vNIGMZDSoxB2EtYOsgmVIh1woRsROXZYDZZsXq6Bi+U+aCSVbCZwdClx9REJmHmC4NeA1dQRjw9gZUEWvk1gxLDTruAQKcELY1jKVbj/gRgq1fGwb1uRBl0MJCYyXVoyRZ7cWBPB/wMibp0BwYkHWqaBiC+WyIHN56jUk94fFb42D17I96hybh+RqjhTTLCI/s67QYxrFqnCD0yWxA8rLFjYE6yQZ1sgau6F/3NTWw0tcORn4ik5TMxxdqHQKwJx2pINFrCyIhRI8dA5pxe0cM+iET9T0QsF0du0kdk1Udj+Ima+pxq6OgRQXJXCjmvX5Ie+5pesaGM9Ui5G45YPdJjDSiwCfjkL63w+N18L2lwE9mdZBEZXlsJsb5tcXjbBV8KxY/UKKX35UTMYFz4uOL9C3soI/ga0Yv/V+87+me7FYn43xCTgqQZibAnm1DJp7d3Ww3sQjC29bnpvePXNR8fMz9mrDTIzzsNUEiN5NtE2KkgkQQ1TnQoJAlldhA1cDAbxZokeBm2uhiyOtvZMRwkxxXJK2zljksVcLFBjfe8rBgFDQ6UkMPiNZKjZMyL12L9p03o7e6FeUYWAixIa0jp+3d1APtrYAx4ZgxuW3FAn/ebxbDqfyPGmWZ7P189omc2ohf/B4MsfWmtefLMS1TtHmTNzGEtEE1+SuCBBKDtc0OdHou2Fj/8PR5cvsyKI+4QmhooiItjnWGNPPVq7KpgqCN3LjBZQxdCKvvp1mheQwmju5shq4UGIdoiGcbCErgwV01lI8MVS/g2txaxRhEuFpB6Crlm2XXY/HEbWmtaYJmUinCsDfUBAu+j/dCzWBRPnMTAxhWCdtxvHw0ev+te3UWvK4FPV43omY3oxf+zQTTXbVAsWQWwqkSMPzsNCfEDmJ5oRwvP7+iJEGpIYajNOsJZPcbZGXJYPHxcLiEvQ4PxjPN/2ORENDkng44eoCECI8GYkEj23KCwWcWEXhZiTUH5D/NKSJYQ7RCRk8EEznqjkpxWXR8BAKFtFFFbDq9ZxGts/dKFrsYessbUB8dHoYGhMHyiF1dfnYm1v9iBEIV3oT4+LbHG62Sz6uPA25eN6JmN6MX/ZhCqzylwDlieLFOiVEZk59pQOMWIpTFsuTL0HOoB4omyGvrUpNSdSEgywUbxdEO3hH61GkWJKqzb1AZRG8OqOpJDFOgJifOS9bAnMLGTau+g4kQKqAlxGZr4vRILvTALvvhE3m884S5pmRLS8U6nQFisgqNAhWvGaPBNg4wm9t17+1giksSscVK5cqgXP702B68+cwhBH8V1PU4oJg380WoEnl86omc2ohf/m0Gyrs1D3Z+qYt7uUZKorcrPs+DSXJ4rPeUA6fD2gIh0inTLGzp4gHaUkUEyMSTV8ABTZkbDRUFDexMp3EgYIlPr9vhhJMIyiBJs8WraR0t6nYUejRtkgSfQW8JhH5SgHmEqTwQqGfOn2mC0q1F3dBDuwRDCrP8euCQW+5pDULFmaegh80u01kiD+Pa0Y/kVefjyfcqHWPVLTh/8VExKKTa4Hp0yomc2ohf/+5ClvnndvUlLFz5SbNPAnubHzaTRW/lkHyQ07ehT4SCTbZJJjeamQeYHEc52BbEWFgFTYjCwj+IEVtuRxmJEVB1pMsk0mFGvJeCiEXw0Ch3HTDTV2+WDTLQVZIs3Oc6BtoZWgE4T8Zr4DDsS080UTTA3NbfhklviGRp1WP8XHzXDGujjBZS2uDG4qw1T56Wi9BsK7IKkbXwSr+dHgDow57ZuDXYu/M5ZlFMFYKfPIM9XK0UFqZjHCjvR5sMSqxG1vPvWbh9KSrToaWMyZxcvQDQ0pFxj5Z2SwSTb040kHuxAvwc2ezT6vW6o6FmRyCTzK2WZzCD772y9sr+hpchagj3GjC724EEVo0AYLFO7FeaHyGRv5f+RGmBoDGLRpcnItemxi0yyQMhryRQhU4Jas6cTE3LMOFHWRe+j4C5E0pKeN8g79h/cewM++eGbp3rw3/X9p8Ug2mvXj7PdvLwkPyqAmckRlQilOyT/ttNDNjWGcXwvEVBtBxO0A34f5Z5MtpZ4CwY9PrZandDpTWwgMQ9YDLDYTehsZRiiSwQkqkl4WFEWG/OCBPfAINGTlUbxw05k1t1MiMsyXpEDcHUNUNsbhk5HBpmt3pzJWcieKKLlRA/669UIqljFp5hhzzUizcJcRgV9WyXrGNY3UGmoGw7DSdTXdrLyxtCahW/wQIekRMP9Oi0GsTxcpiSfX4Dp8URFBEWXssgL8ynfyEbSkSMUJuzshJH0iI0op6+3G4nZ8YSwvRSj6KFn86mJ+lxTlAVZuXZ0dZIsdPWxucTiMhw5KBqKFb1Mg/R3e2FPUcHNsOVsi6jgAzBRappI/V1rUxtzjg4Wo57qRi/0RG12an+bj7ugN5jhYY2jIvUfmx2F3CwBCWNMOP6Nl6HKzTKdMNtkQT+bXu3NXXDewS8YodeIXfjb9yvM+J2Cay/G+NlpmBwvQc9ku9ChRzXzREUjcGR7P/zdYWjY5wgpfnj5ZFqiLVBH6+AL8+B0/Duhrpeq9sQUC2TRz8PluKDIg040o6mpHWlp8eS3dOhsoAqelIyDELadml7Fy3CjCyPYyXpljB3tJ7vh6u9HnN2OlCzC7dJmtFbUwe5IgC9Ijiszg8m7D3mTrZi/xIHDpUG01FHtyNaMaInGIHk0au/RtYL94hF6jdiFv32/qlmPK7j+MmTlRWPOGCvyGUp07GOf8OpR/pUfXQ0MJVQdhhR29GQ/oS17IPQMFatrNUlHEz1EUMwcxhmExWRHUgZQXxtBSn4mb+YMwmCj0YT8yTrs2dwPA1lbibkitcCE0u2NzOX0JAqtw2EPVGG2fw1RcFDfVXukDNmFeWiqrkZ4wI/U3AK4Sc1bWJzGk8qJSmA/OC6IXuY2RUWgYYsZ8qQyeonv/qcl3+F7/zr4M8yvETcIJv4iZLnzx+qUJA3OmhyP88wC1jczb+wMQRqkFpdPOFshkPQS5Vg6BFgMakgACuSsElI4cmAIwGKheE6jgZdFnYudPbe7j0nayvwhsS4JwWiWMW5qHHZu7ICRahWJCbjb2QTFpWdiDxH+hpCUZUN/Yx8SM1PRUlZFcnMQeUUFKN//DXOThf10P/XBKfQEPTIm5bA3QyRndSIl14K+Ng9EhwaDigkNhNHyx3vgfPm8ETm7Ebnof3hoJj94lWX1qndnkbdamSsQ8wfwhw96IXqImLo64GQ+0BNyZk/NRyWpCpGhSmfSQscEHuBhxiWS2uWzqChUHxJNyUQ9Xk8PJBoj6GNY8wVgpkpFIXeVO8mIY1/0cCgH6O9ho8urYOK5eTi+pwReSkzBr7WoKTslPB6oaiICo+iaU7xy0MfC0Yy0opmo5yyJyRHLsJUNTYoeVger/oAXGuaiLujRzV5/B2l7zwuPGtDwpn+YHWTkW7i6c19vSvnx0tSZk2JxFmnwClbl615r4LyHiwmXnT9XF2zJsXBkJsA5MMA47WcC1cJsNyDaFgcVBQy9g92w2RRoxSTC3QixyHa7oYfhhk8xEVXEIKEICuJTP3d5LI5uZXgjMqs+XDXkLTOvLMbut45A7SekZkEZmxSFqLgYnPhoC10zgEmzpqOtvgH+ATLIfhX0lLCm5CZBk2VG4lQrh0o98JJCoZAYNYMS2sv64ft0I/SdFatcB9dEEBesy278ofPzV187VQONuIdEX/W+cs5jl0NLyJkdTSEbqYrNr5TwiVdRrCbA6+VkE9u0GnpEYm4iiz491BTqqlkP2JNJazT7YbJFIS6WTC7jeTS9yTNAakTqo2H4xLaxqufT7edhu/r6ER3HucJWFczpg2jcRTTHgiUkUfkeSccBLdKzUtFb1UYubRqczZ1oKCnD2LGFOLZ3L9yd9CoDp7VMCdRuRSFzViGsaYTC81iK0us6ady6bhav1W0IfLIDhsF2qOzkOElu6mzRqH/qx6d8nqd8gf/uiTCd/aoczLQJP3ziArRWDSIxyoqmk704tqWJ0s4OqIxUgNAQjvRkzmNSDG0WGb6omeLTrSLJqLPIrKwdCCgRTa6HSZf1BiUiIRKAuXkanDjoQ0GRCSXf8ID4AMukYfxhGsprxuyLEvHNxjK4mxWOwMmYtDQf33x2mKLriBI+RHrFj8KJhajYfXBo0iohnlV9dS3rFM4v2pKh03A6KzcNOnqqlRB41hIrvq7xoYXzjI2H66HsPAAN501UyfEwZ6Sy169B473LT/k8T/kC32UQy+QH80NT5lZEpSdh6sU5iKa4bceLlcjJjUb1jnLKPvnEaqk8zMmAi6HGzJatn4dtIQUeEnwYOzkPDa3sFBJxaelBCfYQWlrJUbGGCJMij4QRJ3vrEo3j93fzgGkQr4FNKYHMbzMuu3EBPn7iEAlGF8QA4W8s65J6P3QEF8FaL4zJOnJkHdAwSYcj1XyQ07rMWWljJ6G/so3iBz0sKelIKUqHJdWEMUu0qCJMb2Dx2bvnJMz7jyCDGmNfbCIGbGmUuJpx7LLMUz7PU77Ad3pI5m8UcXYeHNnFsBalIC3TiqrXq5GcH4OGo9VwdVZBYW9Cw5pDy2Ite8p4Fl3tTLhUmSQTQYXVUDGXaClqE3VBNl0HWQQm0iDU45JeL2Z//dARqtrJxkbivsLPLV+ehvffKB+iSsbPjMHhTQ3MRRoWnSLauluQkJdCBTyZ4a+rMfu2y/HVmtfJgTHZUywnhXmPCF1TPIYzjFRFltRRzhKH4tkTED0mAXrWgiHyXgJhduWXBzGZYbO5dh8MhQUIT10EOcqMo0tOvT4ZMYNozlurKOYepJyzhNOvZj5pNhx8eheS2Gjq85IsHOhF2MDmk9kChVAzNiuFqInNJyOpiymJ6OhwQc0dJqKZB8XxBLXKSSY3QosQLvMAi3KiKZ7zEGVR0UA9b2GeHof3VROlyJg8IwM7P2lnviZ1PsT2Bpk/KAyKd8Hbwoqc/7YmO9g2bkTh2XNRsuFzCldCNMY4fq4Szt4uxKZPZui0w8B+f8L4LERl2mHOI6AgUusq60Dr7x8D+WFI0bnIu/1mDJItOHgWMf0pvk75At91f/0tBxU14WnxlfNRWzrArp4GTeuOMER42SAipu9pRtbkQqpNjGhsbGRlboQx3ob8ghzUNrQMyT2zi9lBbA1hzvx4lDBu+z16GoQVuN+HpMRcFI+14osNxzBtQgE2bjpJoUTEU5jIyXH5XQQLXhohSI/iv6dfNh773y8DC46hz8mRGBdwo+BnN6D9gy0YrKxE8pzZaN6zj6Nv7LvnjKNYm/R/cQHiaRCVw47Cc0ntsJnVeqQRpS8/pnhr1ovqtFVz5j5wzy45Px5fzWb78xRfp3yB/+r+whUHWtQOIZn6Z+RfMJYknQdtJeUw1A3C56KyRBvRCwahzeI0LdGXxmQYqs5lMrEGDf+uJ89u0jNUUQhn8LBeIEyNloiuNFi4MBFbtjXyidfBpGtFDMcKSssihQrRlEtiCCM4YP/jsmumYtMH+9HbQQ8TArjyrovw4a/WsqbgeDSfbB3fW5i9DkduBtq+OUyEl0Y4W8mCkCJsTuwqRjscyWO4UMIBQ4odJsLgOctsOFrah/7N29EQplpm4zu7w4JhznlvPQkfQ+PO2YSNp/g65Qv8V/c3XblfCXOGw0inTpuaxbUWBJ3769BfXs6dI9yoQCpi/Pw58Ju1hJ0noI0YhHkkfc44NFY2wWigsIEfnElgGCeMdQuYNDkFJ4520VjkuyLMeohinnAT7r5pLv7tj1+wKtfRg4Bk9loaK1hekHqP5IZbfr4Ezz+2FlffdSHefvZtzL5wMXa9tB4r7rwZ6x9+kV9IT2EtIofIjynsJXM1B6lj5E+cjJPH6yGYU2ArGotrHp9JFT31wU0uuDZ8jbCZNVJsMjq3foEFv1+FHg6lHoi0QE/xdcoX+If7x99wvm3lXRt9nNkwCUHEFSSjaX87jO1OOE9SWULU0ntgG8LMG4akBBZ6jOkkD41UJcpUL5I7YfHGwyYdMue86di/o4pjCUzs4iA9Czh/+VisX1vHcyPiYn4Yk6JD5clIvmD7lp3HAPVdst+IVI4p9DR38N9O3PWrH2LNA+9QFMdqfyhUsfJmi1cfbRgSZwc7OocqdoV9Eng8HFeIgZf9F4VssjpuPGQqG3/0zgocOsnO5XH2SI61IJ4isda8LITqKrHslqnY8NFBpfuu6ae8GWLYDaLNuFOZetedqKJqXR2ieoNTT93fkM5gP8Lk8aK7+hAS8lPRWVfBjQusNwhp1Qw7ajaICs+fh/LDR2GS9CQcSRJSqqNX7BSHKkjP1RDVRNCQFz/gmNtbrLwVNqPuvX0OPttYypqkBn6SkBoMkPPipJSHE1IilSNM+CqtC6EB0i7si2gIcZfduZKUfivK3txMesbLhyYdfSUVSC7OY/g6Ai3rohD1WUmZ42ikGAzaOa/CpQXWsckwUuCta3PDqOP8YlYiQsxnZ1OUsXHNc+bOt+865YHRYTWIYL/JH5NRoPNoBqC56kZEkxrREpK2H+MGBdLYwRb+SQgbdHcxqXKYJiMNwT4mWRaBkdwRGUWYdvlCHNt6kGQi3cFkwlmXEe0wRWz9qJSRhEQh+adf/HI+HnlkO/OPjCKOtFVW1w1BYlFSMZmz4BR7CY0pUaW3mS1OML8PhSGF4woqFoZUXiFn/jjUbd4faQaTHyNaGgpZQEJyMmn6chRMW4zKsjp2J1kkZhbAnJ8F87Q4ivjY12fhr+ecSoNDwVhtGKXs/ZdfmjgsZzksF/k2bOnGP6rE2WPR/OXNQu7aRkVrIsfUHEB3STOMnO9zVZ5k36GX0LEDij1maKQs0iiftmwRju87ONQI0qfHQRnwQZcTjynzJ2PL2s8QbYglsoo06Lh9gSs17rp3Kdb85g1oaKmpBSQPKypJqxAiCyYCJxcuvDgT2z6vZ4/EhwHCXGM6c1g1paVahr0EB1Utdoy/6Gysv/spUvgy1G4PC0PWI+x1iGYji0yyAdwepDZmQbDkwpxGgywqpJjOjPQ8UmsheEEAABMgSURBVD5knWUCDj8jbIZbwmvXPvmwvPv+X51i+hj69mEzSMa5977baSi8Kieaveg3VwgXb29QumxJ6CXk7dnbAtS0wd3eBp+H5S6ha96cRWjc+zUm3nQtmququMQhBm2Hy6ge5PzOyuU4sn7H0NxfyEJxAw3HCUJ2iThFq3aRtY0kYvtQyNLz3wH2Vm67bS4ysxy4bfVrLPbiibZ6OOCTjJNHBvDTB67G7+98HIlTstF8kIwyc49C6Ksi1E7Oz2V/JBnHP36f84wX4MSmdVC4GE0gAhOsuURf8+CLi4d6cQKyZhuRRJWLhcVhPTuWkzjKsP29epTeShp7mF7DdqGkaT8swyU/LUx3OrHv0XmCfuljN173xp2vHDzqRy/Z12BHGwZJVfgbD9AznFS3k+RrbKKHkBpRcVFMDKtgynxUavYzuKtEJVEFwrGEOFb4E2ZMxIb3P4ImTObV4uMoMwduIkl4KAxR6qD04fKVZ+ODP5WwwmcxSBWj3mqGr49cE0cTigkkSrkzKz2vEPWHjjEvhJDJeqeprJq5gYm9tQNzb74eu597cagVTD4G6ePmob2WsSluOsxLJiDmwgQaR0A6G2gynw0yQQzFXmy57llS2PcP2zkO24XSpq7Kirr98dpsDuivX5UrRM38Xcy8j1b39pf4Ubqxi2ikBYHGNsQSqnc3HKDLq3jAHkg2zoW4KGxgOp7902tIk6/lE6rFkiduxfZfv8KtcLFYevl52PTnT4bCi0arxXlXT0ZTeS/KdlcgQNHbq3+6FTdd/Qp+9/INpE62YN650/DcmtegdNKjbEEEXCKmcCrr2KZduPalX+NPP/q3v3obw1TyjNlo2fXVEOxNzWZSP1nKPEOahAsM9MZx0I6ZAWFFBmyLYlBk52AQe/EgFTMQFrHu9xUYeOmdC1H/2IZhcpDhC1mRNzTmjTplAou9D+dT5ZzzrC79+ev9CUQ5Ndu64SflLXf1wtdWj7QxsfA627gEIJ1xP4jK/bs5vqaBuTBnaNGMwCaSOqL2SLMg1ObD1Xdeja++3oPAQA9mLZ+D9Wu+wmW3zsefX1/PPMzYL7PK12WwXmHTiWlJMQaQkGpG3syp2PPy5wiLArSsS+Q45hl2/2SqIRc9fz++uuNXCHCZAEhAmtMS4GY7l8scMXHmbHio9WroiELhDy5F50wBtjQNrszgLChr1kN0os/KPKh5+hiktxcM20M9rDkkcrGip/Yp4xdNxXsTydLxlbh9QEkDWdLNffASZaGRK5K6mpGW70Dd4S8p5QlBm0OkVV9PYo8JPSsNvtpOVstEWBw5EDhwI7IPkTK9GHV7yoe4LUlvxpRFyTi8cx/3nZh4gBRT620IkAoXePASqfSIkVc/uBovPfwCq3HCXclETqsf1z/3c7x58z1Qs6U79+qL8Jc/fUQRHVvH5Mdkfg85Foy55GZUbfuCD0U0lY5TkHXjYmhnGTE9ScA18TIGOPzzNId+tq5rgvjG55D33TZ6DZJ023vLz111+Ya3L/wJawDTh9kvPnBFWpwRleu7EYrsRTxRQ3KPSd3LdUkcX1NkigcMRooImAeoLpGCbsy/gcOv3IvV9/U3rC1KKIkiLNUzrHlZTXNYR8uG0zm/XInP17wHHXMOxSLMCRo88sIv0FBVjZefepV631jOibD12sLhm9w4BKo6WQySguFzoiJUjmcfpIV0SQTm0mIQCGFZvJBBEJA3fTYqifiyp1wGFzuUcasmIWqSCTekKVhB7jAy2Xt7CbdIbCqB8PGfw3LFmmHdMz+s1o14xeojYeWFC+7kIfHpJnW98PGVqN/YjS5K/KWaVugj9LmnlSsvWFeEaJRIjKHCJLK5Us064sJf/RIbHnoc4UjVTK2WwCXJFhJ33laOLzM/3XDvTXjjyVfx0GuP4Inr74WXT6wSmTvwUiyhMtMTAvjxs3fg97c9xidehR9/8Ee8eOkqnj1VjMxUC665DMapRfhs9X00MuE1BXhxC+aiaetWJKWloI0Fq6hPRXTa2TAWFcN4SQEmTzfgKgr8ipk7nq/34cVqdi03bIG89YupqPvjoeHKH8MesiIXvHp9U+37d76TJYU4lZQ5Bmc/cRG6PAKqt7IOOVoLf0sbVF0NbByxFiEdksAdir0nG2CfPhldx1mLcM/JuXfcgq2/f4OJNiKwpvfwYK9860G8f9vjkTWv9D5KiagJvomf++DxZ0mRkBKh4W554z5Ub9+DL18idGXBF9m7teLHF+HjZ19GZk4WGo6X0/haKKRQIvWMirkqMS0VraQ/RCbp6JRMGNnXcMo26FxGRE2ZguRbJyGhIIhl5N1U7KW8RGB4sJICug/ehbzhJ8P+QA/7BSNGEce+ohhMbKdyjMycNxFXPjEZnz7XDH+ti8OYDVDqaBgvRdDB+r8WY4S+MkNTRLArsppWovXQsBMXam6h4ygYM2MmTh5i+GLI+cHrj+L9W+7HLc8/hZd/eC8TNmEo5xLVlAlFFO86JlyZ7dgw1fCqAOVCzFNqhiU5sgqbXcGld/wUnz39R+aRQeQuPg8VX3wGraTG2LMW4/D2rRzuISUaNxaZKTTEHUuhpGqRUATkcV6+marJLRSB9+44xqy+EfKh4d+SPSIGybt9S0l7Sc84Pel0L6kOx/xiaJkHBohMBsqrEc1quqvhONnYBhrByRBBATR75pHlALMuvQp713/CmoQhhmEve8Ui1H95jDOJrAnYWLr8Nz/DB0+/ycON/JtJgAZUs4659OVHYGG9uOnNt3H+bTfhzStX46KXf4v9n65DC9nZc95cg03XryakpXGYi+b88FrsokhEzUUDYRaq05ZfjSMbP4DOwEGiCQthWDxvaDh0YKwNyQuiEM85xsp6bpZlXx2ffgZp547VaH71ueEMVyMSsr59g8bzP1Bi1UYEWAB6OVtRcNZY1O0n9G3rhYfaJ7m9EWZyQRrG5a6KXUgsnMUqmP0QGnHPuk+ZP1h9UfIz8+EHsP+hJ5F72SUoLErDul+vGVKsqFglR743wu4KnA0U+KdEaYjKrx2Sm6788HX8efVPIXXScKxf5q9eja+feYoex4qO8+wL7rwVvppaHNm2E3nLfoCKTR/Czuq9aPX9aNhPLwZnQQoyoGH/JX0iR7BJVbFzC+fO4xD+shXyngdH5GEekYt+axTtlRuUYqoCG8bmIpebqAdPDqCT6pNwaRl0RE3dNdwb5mul8lBNuptNJ74bgRBWjHBaBh5Iex2RUeSAeUXuPUm7cgWa3nmf/9BzoMdA6kOL4jkzsHfbl8wBAcw+bymOfrkT6lQHvFU1WPnEo3j3jrsJHsIwZWZzdyND5NBkh5/TDmSDFdeQTkshHT/twpvRGAl/R1oJFGxQ8sdAX5CJ6NkxSJ9ixoGjzfBVkkX+ejfkowfT0PZG83B7x4h6yLdvNuXGHUoCJ286ZoxHQRLH1z6mxLOB487t7dBTfDbYwLauysXmEkXNAR9FatksGjugpvxQjEuj7pbdKBU5WaIzKuUoqMulrqoKy598GBvu/hXIYOLip36Bzat/DWFGAfx7y+kAzEXkuWQSnUo/N2NGwlp2NsQqIjvWOwkTJ6KnohamvHEQmOC9QW481bM3ExOLYCuTvT2RIrlMGPIcyFyQgAb2crwsWL0l30Bme0BpfGnEHuQRu/DfPz3z/1itDGiNsM2KR/P+DvQeJt/Uwpn0unqmgh7Y4rhFoZ7dRG8FK2oyqAsXo2rvDroL95XMXITW/ZzdpxD7onvux/pHn+C8HzktUusBqhz11OqazQxvTCeFZ83Bnj+SbmEBee6PrsUXL7yCeTfcQm+Quc/XhbZDuzB+ylR8/cF77LvzG9iV1FJkp2ZxaJ98Nvp93Fa3aA43z3HpcqT/MSOeoVEkCVrJWuYwAhXHEWp4YUTPbEQv/vdGuX6XR9lDiU8KZ/o6Tnq5abQPXeUcGSPBqGUt4Oquo/yGUFiKKEEuQvnnm2HJyYWzrowHaiaIdSF7+VWo3riWPZUY5C9bhq6DO+BsrEXRT+7HsdeeZM5hLcMG1IRLVuHEuj+RKbaytUvoTBQmss5RMSQFqQGOm7oMfYc3DV03YcEKBNtYF/XomNMSEHvTYvTExyLHGoTJYEHTtloYEzjD8syL1HM9O+LnNeI3+NYo8y58cFbU07/cU7ulDpm5qThZ7mMnkR7SUotoqp97S/chsSgTTUd3IjWPCvUT+8kKs2BkJU92EGNnzcGJ/ScIb9WsRdhTIVyOUCUKBz2VyFQUt18LvSw0VWHMW3kDDn74GRGeCzFTp6P3EGkaDgeJ/N7Ib+KZsvhyHN69jaJsrnjKn45+LskcM/5cWFfNRsfuk4idVYAlK0z0HAXf7O3C7pc/YZgqwUDFqyN+XiN+g7/3kkXPlSnjVuWigwOeDb1a1O/pZWxmUufv/hioLEWI0Fb2UYXoa+E8DufN2cgqOOtSnNyxbmjoc0iEwK7hhAWLcWznFlIeDmScvYgaaCuVKzYuTm7H8U0bWH+wFqIh1QSuwcj3cBOKj+3j5PGzYCJlY4jJRsnuHaTtYyhDSoMpOgkZi1gErqRC5mA3llzvQBT50ZJSCQff+4KocBd6vvrdaTmr03KTb41ivvtr5UcPzUIsoc7unVRvENqe2EGeqaaHq/zY2qVy0U/1dIxFgbOzCckZUag+cgCFc89B+a7PInzjEAUfeaVOmoUO6rfCfeTFrDbIHGugwxASqxHFNeUCc0DR+RfCx3WBvZ+8h9jiaSjf9gZiimZzc0MTcQJF1Uljhuj72PQURC+ZjAWXJ6Ct14fxeRzXPhlG5Rtrt9Q+e8OSkUBT33XN02qQoTfxoCKuuU+SdJT2NLJRdKxdxNG3KV5udMNH5BXu7uJwRz8F1f0cH+hB0pgMdFbs5YAnCzKGHXNyEjxt1SzZqIBXc9KH1bfAX2mhcnPmhK3e5EmT0HTsCDuQqYilHivhjtuHlIs9+05gsKmekiRugLASUYkGUOsOc0QLlp2Fy+8rwCWpahyiwn1LRQhH3/o43PXstcNKHP5PDHv6DfLtu6JhHr9Hlr7k/J+ObGvr0SCadjazmqcui3veXX29bM8K3HtCCBzqhiMlHn2dbYTHhMGM7TGE0ta0DNQfPUJGmPPqbAEL3LfFvZf0sCTEX0oScd50rpjlaPW7m3Dy/Q1M4tR6mSmG0HFkLieTasoY6Lg9W50komiJDfMLo/Hm9m4cvzD5jJ3LGbvxt3YxLV2jxCxagTELk+GhaKGP6sOAkwpEbvVxlVKTxbWuzhO1kNwDyMygxqu8jGiYjDFpFVWkhcsVG/HT5rOuqKCXDMKqM8Nx8SLWHUkwcsTZxO2lX9zzAWcX2ZtnW9cQZx9a4WS+ZD7iawegSjBRu2uBt9eJuXNi8cIz6zMGnrqEPYIz8zrjBon82FHnPSw5iheKdmp0I+stJO4jaadkM+jmlh4KGAJc8epp62QBqUaYay6i7Anoo1hbxzolxF6KKTGBB9qD2Mx0hjEFOg7ZZGRy59bEaPz5p5+ybcz/Dw9SUcJ6hcObmjjOpCzPRCK3moqc3q3cQQlpz+HAtGsu1K09i5NBZ/B1Rm/+9z938rLbZU3qJEGdMBVjluXCRPh6bHsvnFwKEyXwIIlXe/h7QIwcXxBiDFTQc3qXU1YKB0IlHYlIFp6iUWIrV4v4yG/eyQhxgxzbta1EWV6uCKZsR2QjS8/VHo4ZHH/IMaB5n4cfpXAe+fRp1/5nf3YG7fC3W48ag0TeUdKylYrePgOhhDkYu6IYKYztnVw8U1fN9Utkds1UiAxwE7WbKm6ZYw0RgZ1EAkxN+KVh6NJTC6wlzZ5KxaOO6pQ9pVxXzj1ZJjK6kXGDGANpk2IKwPmbebZvbUbtnzfDv/nUx9CG05CjyiCRHyxtyUWKxjEDavtUxE0Zh6JJVmRwEDeW26zriZZ2dGrQx4IuZOTTTpV7Bo2QqKZ6hP0KI78mzIrcTtj8FVdqnKSES2GvPNLvCPS64FBHoe1YF5o/3wOpsRy+gyPD2J6KgUadQWIXX0IvcTA0ZUAbMwXGuGw4+DtD0rINyI0OopU54wAnffTsmWcwX+QSiUUWkeXxTyuN08qet4uzBnso/fmcvGIrxx0Geyl+aOGvXeXmOIXUv0CS0Fv51Kj72SOGHJVvynrunYo5KY5ukQRDxDjJWbCw/jBwe3WuVaKcOojjQQMlORIujaXWluI2Ndf/9Xi55YdUioNzMxupLjzC30lVz1/wIrVS7VLbAPF4BZSqSkila0blzz1qDfIPLp90s1Gr0bmD6RmCdeVFyF6YxgWW3M5AbuoA12hUcQtpgJNtkVHylEQRaTESjlZQnV5BUpHrnQKVNZDYOlZx66nU0Z+O/j+xMz46X6P2Sfmu41Jn3OJFbJxB4u4skYUdB8pJQBKFUbAgs4uoS40jfd4KiSs7xH4q6/tJOHZz53V///3B3vceHZ1m+P/v6l/OIP/pQAV18qoZgqDdKrCvLkf68Frx81BV7HXkaCJy9n+517+6Qf7lDvyfveHvDfLPTug0///3BjnNB/7PbvfvnbAHq+m0TJMAAAAASUVORK5CYII=";
window.addEventListener('load',function(e){
    console.log("loaded page");
    context.drawImage(png,0,0);
    drawImage();
});