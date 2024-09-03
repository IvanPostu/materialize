describe('Scrollspy Plugin', () => {
  const fixture = `
<div class="container">
    <div class="row" style="margin-top: 100vh;"></div>
    <div class="row">
        <div class="col m7">
            <div id="introduction" class="section scrollspy">
                <p class="caption">
                    introduction
                </p>
            </div>
            <div id="initialization" class="section scrollspy">
                <p class="caption">
                    initialization
                </p>
            </div>
            <div id="options" class="section scrollspy">
                <p class="caption">
                    options
                </p>
            </div>
        </div>

        <div class="col hide-on-small-only m5">
            <div class="toc-wrapper pinned" style="top: 0px;">
                <div style="height: 1px">
                    <ul class="section table-of-contents">
                        <li>
                            <a href="#introduction" class="">Introduction</a>
                        </li>
                        <li>
                            <a href="#initialization" class="">Initialization</a>
                        </li>
                        <li>
                            <a href="#options" class="">Options</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
`;

  function repeatString(str, count) {
    let result = '';
    for (let i = 0; i < count; i++) {
      result += str

    }
    return result;
  }

  let scrollspyInstances = [];

  beforeEach(() => {
    XloadHtml(fixture);
    scrollObservers = [];
    const elements = document.querySelectorAll('.scrollspy');
    scrollspyInstances = M.ScrollSpy.init(elements, {
    });
  });

  afterEach(() => {
    scrollspyInstances.forEach(value => value.destroy());
    XunloadFixtures()
  });

  describe('Scrollspy table of contents manipulations', () => {
    let scrollObservers = [];

    beforeEach(() => {
      scrollObservers = [];
    });

    afterEach(() => {
      scrollObservers.forEach(observer => observer.disconnect());
    });

    it('Clicking on an item in the table of contents should scroll to the corresponding content section', (done) => {
      document.querySelector('#introduction p').textContent = repeatString("test1 ", 900);
      document.querySelector('#initialization p').textContent = repeatString("test2 ", 900);
      document.querySelector('#options p').textContent = repeatString("test3 ", 900);

      const viewedSection = [];
      const observerCallback = (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            viewedSection.push(entry.target.id)
          }
        });
      };

      const observer = new IntersectionObserver(observerCallback, {
        root: null,
        threshold: 0.5
      });
      scrollObservers.push(observer);

      let elements = document.querySelectorAll('#introduction');
      elements.forEach(element => {
        observer.observe(element);
      });

      elements = document.querySelectorAll('#initialization');
      elements.forEach(element => {
        observer.observe(element);
      });

      elements = document.querySelectorAll('#options');
      elements.forEach(element => {
        observer.observe(element);
      });

      document.querySelector('a[href="#introduction"]').click();
      setTimeout(() => {
        expect(viewedSection).toEqual(['introduction']);
        document.querySelector('a[href="#initialization"]').click();
        setTimeout(() => {
          expect(viewedSection).toEqual(['introduction', 'initialization']);
          document.querySelector('a[href="#options"]').click();
          setTimeout(() => {
            expect(viewedSection).toEqual(['introduction', 'initialization', 'options']);
            done()
          }, 200)
        }, 200)
      }, 200)
    });
  });
});
