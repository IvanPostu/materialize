describe('Datepicker Plugin', () => {
  const fixture = `<div class="row">
  <div class="input-field col s12">
    <input type="text" class="datepicker" id="datepickerInput">
  </div>
</div>`;

  beforeEach(() => {
    XloadHtml(fixture);
    M.Datepicker.init(document.querySelectorAll('.datepicker'));
  });
  afterEach(() => XunloadFixtures());

  describe('Datepicker', () => {
    it('should open and close programmatically', (done) => {
      const input = document.querySelector('#datepickerInput');
      const modal = document.querySelector('.datepicker-modal');
      expect(modal).toBeHidden('Should be hidden before datepicker input is focused.');
      M.Datepicker.getInstance(input).open();

      setTimeout(() => {
        expect(modal).toHaveClass(
          'open',
          'Datepicker modal should be shown after datepicker input is focused.'
        );
        M.Datepicker.getInstance(input).close();
        setTimeout(() => {
          expect(modal).toNotHaveClass(
            'open',
            'Datepicker modal should be hidden after datepicker input is focused.'
          );
          done();
        }, 400);
      }, 400);
    });

    it('can have a string format', (done) => {
      const input = document.querySelector('#datepickerInput');
      const today = new Date();
      M.Datepicker.init(input, { format: 'mm/dd/yyyy' }).open();
      M.Datepicker.getInstance(input).open();
      setTimeout(() => {
        const day1 = document.querySelector('.datepicker-modal button[data-day="1"]');
        day1.click();
        setTimeout(() => {
          const year = today.getFullYear();
          let month = today.getMonth() + 1;
          month = month < 10 ? `0${month}` : month;
          const value = M.Datepicker.getInstance(input).toString();
          expect(value).toEqual(`${month}/01/${year}`);
          done();
        }, 400);
      }, 400);
    });

    it('can have a format function', (done) => {
      const input = document.querySelector('#datepickerInput');
      const today = new Date();
      const formatFn = (date) => `${date.getFullYear() - 100}-${date.getMonth() + 1}-99`;
      M.Datepicker.init(input, { format: formatFn }).open();
      M.Datepicker.getInstance(input).open();
      setTimeout(() => {
        const day1 = document.querySelector('.datepicker-modal button[data-day="1"]');
        day1.click();
        setTimeout(() => {
          const year = today.getFullYear() - 100;
          const month = today.getMonth() + 1;
          const value = M.Datepicker.getInstance(input).toString();
          expect(value).toEqual(`${year}-${month}-99`);
          done();
        }, 400);
      }, 400);
    });
  });
});
