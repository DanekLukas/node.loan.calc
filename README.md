Application **git@github.com:DanekLukas/loan.calculator.git** is an FE for BE **git@github.com:DanekLukas/node.loan.calc.git**
To run these applications clone them in a directory, run `npm install` in each of directories and `npm run build` for BE and `npm run build-no-map` for FE. Afterwards copy built FE application to BE using command `cp -r build/\* ../node.loan.calc/build/` and run BE `npm run start` (it will run on port 8000 in defautl, if you want to run it on port 9999 use `PORT=9999 npm run start`)