import {svrUtil} from './svr-util';


fdescribe('svrUtil tests', () => {

  describe('toFixed tests', () => {

      it('should do all this', () => {

        const results = [];
        results.push(svrUtil.toFixed('xx.123456789', 8));
        results.push(svrUtil.toFixed(12, 8));
        results.push(svrUtil.toFixed(12., 8));
        results.push(svrUtil.toFixed(12.0, 8));
        results.push(svrUtil.toFixed(12.1, 8));
        results.push(svrUtil.toFixed(0.123456789, 8));
        results.push(svrUtil.toFixed(1.123456789, 8));
        results.push(svrUtil.toFixed(12.123456789, 8));
        results.push(svrUtil.toFixed(123.123456789, 8));
        results.push(svrUtil.toFixed(0.0000000001, 8));
        results.push(svrUtil.toFixed(1.000000000009, 8));
        results.push(svrUtil.toFixed(.999999999679, 8));
        results.push(svrUtil.toFixed(0.0000041, 8));
        results.push(svrUtil.toFixed(0.00000412, 8));
        results.push(svrUtil.toFixed(0.000004123, 8));
        results.push(svrUtil.toFixed(0.00000001, 8));
        results.push(svrUtil.toFixed(0.00000009, 8));

        expect(results).toEqual([
          NaN,
          12,
          12,
          12,
          12.1,
          0.12345679,
          1.12345679,
          12.12345679,
          123.12345679,
          0,
          1,
          1,
          0.0000041,
          0.00000412,
          0.00000412,
          1e-8,
          9e-8,
        ]);
      });


  });


})
