require('../helper');

var http = require('http'),
    db = require('../../config/database').get('albums'),
    server;

var myNewAlbum = {
    album: 'Lets get Phreaky',
    artist: 'Phreaky Phil',
    genre: 'Rock',
    stars: 4,
    explicit: 'on'
};

before(function() {
    server = http.createServer(require('../../app'));
    server.listen(0);
    browser.baseUrl = 'http://localhost:' + server.address().port;
});

beforeEach(function(done) {
    db.remove({});
    db.insert(myNewAlbum, done);
    return browser.ignoreSynchronization = true;
});

after(function() {
    server.close();
});

describe('Albums CRUD', function() {
    describe('Given i visit http://localhost:3000/', function() {
        it('Then i see a header that says OMG Albums!', function() {
            browser.get('/');
            element(by.tagName('h1')).getText().then(function(text) {
                expect(text).to.equal('OMG Albums!');
            });
        });
        it('then click on the main link arrive at index', function() {
            browser.get('/');
            element(by.linkText('Let me see them RIGHT NOW!')).click().then(function(url) {
                browser.getCurrentUrl().then(function(url) {
                    expect(url.split(':')[2].split('/').pop()).to.equal('albums');
                });
            });
        });
    });
    describe('Given i visit http://localhost:3000/albums', function() {
        it('then i see an h2 header that says Albums', function() {
            browser.get('/albums');
            element(by.tagName('h2')).getText().then(function(text) {
                expect(text).to.equal('Albums');
            });
        });
        it('should hacve a list of albums with a count greater than 1', function() {
            browser.get('/albums');
            element(by.tagName('table')).all(by.tagName('tr')).then(function(count) {
                expect(count.length > 1).to.equal(true);
            });
        });
    });
    describe('Given i visit http://localhost:3000/albums/new', function() {
        it('then i will see an h2 header that says Create Album', function() {
            browser.get('/albums/new');
            element(by.tagName('h2')).getText().then(function(text) {
                expect(text).to.equal('Create Album');
            });
        });
        it('then fill out the form with a value in each field it should post to database', function() {
            browser.get('albums/new');
            element(by.name('artist')).clear().sendKeys('Phreaky Phil');
            element(by.name('album')).clear().sendKeys('Get your Phreak on');
            element(by.name('genre')).all(by.tagName('option')).then(function(options) {
                options[2].click();
            });
            element(by.tagName('form')).all(by.name('stars')).get(3).click();
            element(by.id('submitBtn')).click().then(function() {

                browser.getCurrentUrl().then(function(url) {
                    expect(url.split(':')[2].split('/').pop()).to.equal('albums');
                    element(by.tagName('table')).all(by.tagName('tr')).then(function(count) {
                        expect(count.length > 1).to.equal(true);
                    });
                });
            });
        });
    });
    describe('Given i visit http://localhost:3000/albums/:id', function() {
        it('then i will see an h2 header that says Create Album', function() {
            browser.get('/albums/' + myNewAlbum._id);
            element(by.tagName('h1')).getText().then(function(text) {
                expect(text).to.equal('Showing Album: ' + myNewAlbum.album);
            });
        });
        it('after clicking on edit link land at edit page for said id',function(){
          browser.get('/albums/'+myNewAlbum._id);
          element(by.linkText('Edit')).click().then(function(url) {
              browser.getCurrentUrl().then(function(url) {
                  expect(url.split(':')[2].split('/').pop()).to.equal('edit');
              });
          });
        });
    });

    describe('Given i visit http://localhost:3000/albums/:id/edit', function(){
      it('then i should see an h2 header that says Edit plus name of album', function(){
        browser.get('/albums/'+myNewAlbum._id+'/edit');
        element(by.tagName('h2')).getText().then(function(text) {
            expect(text).to.equal('Edit ' + myNewAlbum.album);
        });
      });
      it('should update album after entering data and clicking update', function(){
        browser.get('/albums/'+myNewAlbum._id+'/edit');
        element(by.name('artist')).clear().sendKeys('Phreaky Phil2');
        element(by.name('album')).clear().sendKeys('Get your Phreak on2');
        element(by.name('genre')).all(by.tagName('option')).then(function(options) {
            options[3].click();
        });
        browser.sleep(2000)
        element(by.tagName('form')).all(by.name('stars')).get(4).click();
        element(by.id('submitBtn')).click().then(function() {
            browser.getCurrentUrl().then(function(url) {
                expect(url.split(':')[2].split('/').pop()).to.equal('albums');
                element(by.id('artist' + myNewAlbum._id)).getText().then(function(text){
                  expect(text).to.equal('Phreaky Phil2')
                });
                element(by.id('album' + myNewAlbum._id)).getText().then(function(text){
                  expect(text).to.equal('Get your Phreak on2')
                });
                element(by.id('genre' + myNewAlbum._id)).getText().then(function(text){
                  expect(text).to.equal('Country')
                });
                // browser.driver.sleep(5000);
            });
        });
      });
    });
    // describe('Given')

});
