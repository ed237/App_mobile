import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {  NewsPage } from '../news/news';


/**
 * Generated class for the SqlitePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 const DATABASE_FILE_NAME: string = 'data.db';

@IonicPage()
@Component({
  selector: 'page-sqlite',
  templateUrl: 'sqlite.html',
})
export class SqlitePage {


  nextPage = NewsPage;
  private db: SQLiteObject;
  livres: string[] = [];
  titlelivre: string;
  ratinglivre: number; 
  //titleLivre: string;
  descriptionlivre: string;
  categorielivre: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite) {
  this.createDatabaseFile();
  }
  private createDatabaseFile(): void {
    this.sqlite.create({
      name: 'const DATABASE_FILE',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        console.log('Bdd créé !');
        this.db = db;
        this.createTables();
    
    
      })
      .catch(e => console.log(e));
  }

  private createTables(): void{
    this.db.executeSql('CREATE TABLE IF NOT EXISTS`livreS` ( `idlivres` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `nom` TEXT NOT NULL, `eval` INTEGER NOT NULL, `desc` TEXT, `categoryid` INTEGER, FOREIGN KEY(`categoryid`) REFERENCES `CATEGORIES`(`idCategories`) )', {})
    .then(() => {
      console.log('Table livres creates !');
      this.db.executeSql('CREATE TABLE IF NOT EXISTS `CATEGORIES` ( `idCategories` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `nom` TEXT NOT NULL )', {})
      .then(() => console.log('Table Categories creates !'))
      .catch(e => console.log(e));
    })
    .catch(e => console.log(e));
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter SqlitePage');
  }
  public saveMyLivre() {
    console.log('livre name -> ' + this.titlelivre);
    console.log('Rating -> ' + this.ratinglivre );
    console.log('Description -> ' + this.descriptionlivre);
    console.log('Categorie -> ' + this.categorielivre);
   // console.log('Livre -> ' + this.titleLivre);

    // INSERT INTO `CATEGORIES` (name) VALUES('Test');
    // INSERT INTO `LIVRES`(name, eval, desc, categoryId) VALUES ('Nom livre', 3, 'Description', 1)
    this.db.executeSql('INSERT INTO `CATEGORIES` (name) VALUES(\'' + this.categorielivre + '\')', {})
      .then(() => {
        console.log('Categorie inséré !');

        this.db.executeSql('INSERT INTO `LIVRES`(name, eval, desc, categoryId) VALUES (\'' + this.titlelivre + '\', '+ this.ratinglivre +', \''+ this.descriptionlivre +'\', last_insert_rowid())', {})
        .then(() => console.log('livre inséré !'))
        .catch(e => console.log(e));

      })
      .catch(e => console.log(e));
  }

  public retrieveLivre() {

    this.livres = [];
    this.db.executeSql('SELECT name FROM `LIVRES`', {})
		.then((data) => {

			if(data == null) {
				return;
			}

			if(data.rows) {
				if(data.rows.length > 0) {
					for(var i = 0; i < data.rows.length; i++) {
            this.livres.push(data.rows.item(i).name);
          }
				}
			}
		});
    
	}

}
