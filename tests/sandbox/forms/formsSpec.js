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
    it('Programmatically initialized textarea resize', () => {
      document.querySelectorAll('.materialize-textarea').forEach(function(element){
          M.Forms.InitTextarea(element);
      });

      const el = document.querySelector('#textarea');
      const pHeight = el.clientHeight;
      el.value = 'This is line 1.\nThis is line 2.\nThis is line 3.\nThis is line 4.\nThis is line 5.\nAnd this is line 6.';
      keydown(el, 13);
      expect(el.clientHeight).toBeGreaterThan(pHeight);
    });
  });
});
