describe('Forms:', function () {
  beforeEach(async function () {
    await XloadFixtures(['forms/formsFixture1.html']);
    M.CharacterCounter.init(document.querySelector('#character-counter'));
  });

  afterEach(function () {
    // XunloadFixtures();
  });

  let inputs;

  beforeEach(function () {
    inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
      input.focus();
      input.blur();
    });
    window.location.hash = '';
  });

  describe('TextArea Resize', () => {
    // it('Programmatically initialized textarea resize', () => {
    //   const element = document.querySelector('#no_autoinit_textarea');
    //   M.Forms.InitTextarea(element);
    //   const textareaHeight = element.clientHeight;
    //   element.value = 'This is line 1.\nThis is line 2.\nThis is line 3.\nThis is line 4.\nThis is line 5.\nAnd this is line 6.';
    //   keydown(element, 13);
    //   expect(element.clientHeight).toBeGreaterThan(textareaHeight);
    // });

    it('Textarea with "no-autoinit" class is ignored by init logic', () => {
      M.AutoInit();

      const element = document.querySelector('#no_autoinit_textarea');
      const textareaHeight = element.clientHeight;
      element.value = 'This is line 1.\nThis is line 2.\nThis is line 3.\nThis is line 4.\nThis is line 5.\nAnd this is line 6.';
      keydown(element, 13);
      expect(element.clientHeight).toBe(textareaHeight);
    });
    // it('AutoInit textarea resize', () => {
    //   M.AutoInit();
    //   M.AutoInit();
    //   M.AutoInit();
    //   M.AutoInit();

    //   const el = document.querySelector('#textarea');
    //   const pHeight = el.clientHeight;
    //   el.value = 'This is line 1.\nThis is line 2.\nThis is line 3.\nThis is line 4.\nThis is line 5.\nAnd this is line 6.';
    //   keydown(el, 13);
    //   expect(el.clientHeight).toBeGreaterThan(pHeight);
    // });
  });
});
