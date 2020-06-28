import Vue from 'vue'
import Router from 'vue-router'
import Login from "../components/Login";
import Index from "../components/Index";
import Studying from "../components/Studying";
import Analyse from "../components/Analyse";
import Book from "../components/Book";
import Competition from "../components/Competition";
import Pre_test from "../components/Pre_test"
import Relax from "../components/Relax"
import Study_card1 from "../components/Study_card1"
import CompetitionDetails from "../components/CompetitionDetails";
import RankingList from "../components/RankingList";
import PkCompetition from "../components/PkCompetition";
import teacheradmin from "../components/teacheradmin";
import studentlist from "../components/studentlist";
import classlist from "../components/classlist";
import statistics from "../components/statistics";
import teachercompetition from "../components/teachercompetition";
import ArenaCompetition from "../components/ArenaCompetition";
import spellword from "../components/spellword";
import Textbook from "../components/Textbook";
import Consolidate from "../components/Consolidate"
import unittest from "../components/unittest"
import changepassword from "../components/changepassword";
import studycard from "../components/studycard";

Vue.use(Router)
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: "default",
      component: Login,
      meta: {
        roles: ['student', 'teacher']
      }
    },
    {
      path: '/Study_card1',
      name: 'Study_card1',
      meta: {
        roles: ['student']
      },
      component: Study_card1,
      children: [
        {
          path: '/spellword',
          name: 'spellword',
          meta: {
            roles: ['student']
          },
          component: spellword
        },
        {
          path: '/studycard',
          name: 'studycard',
          meta: {
            roles: ['student']
          },
          component: studycard
        }
      ]

    },
    {
      path: '/Relax',
      name: 'Relax',
      component: Relax,
      meta: {
        roles: ['student']
      }
    },
    {
      path: '/RankingList',
      name: 'RankingList',
      meta: {
        roles: ['student']
      },
      component: RankingList
    },
    {
      path: '/PkCompetition',
      name: 'PkCompetition',
      meta: {
        roles: ['student']
      },
      component: PkCompetition
    },
    {
      path: '/ArenaCompetition',
      name: 'ArenaCompetition',
      meta: {
        roles: ['student']
      },
      component: ArenaCompetition
    },
    {
      path: '/teachermain',
      component: teacheradmin,
      meta: {
        roles: ['teacher']
      },
      children: [
        {
          path: '/',
          meta: {
            roles: ['teacher']
          },
          component: studentlist
        },
        {
          path: '/studentlist',
          name: 'studentlist',
          meta: {
            roles: ['teacher']
          },
          component: studentlist
        },
        {
          path: '/classlist',
          name: 'classlist',
          meta: {
            roles: ['teacher']
          },
          component: classlist
        },
        {
          path: '/statistics',
          meta: {
            roles: ['teacher']
          },
          component: statistics
        },
        {
          path: '/teachercompetition',
          meta: {
            roles: ['teacher']
          },
          component: teachercompetition
        },
        {
          path: '/changepwd',
          meta: {
            roles: ['teacher']
          },
          component: changepassword
        }
      ]
    },
    {
      path: '/studentmain',
      component: Index,
      meta: {
        roles: ['student']
      },
      children: [
        {
          path: '/',
          meta: {
            roles: ['student']
          },
          component: Studying
        },
        {
          path: '/Studying',
          name: 'Studying',
          meta: {
            roles: ['student']
          },
          component: Studying
        },
        {
          path: '/Analyse',
          name: 'Analyse',
          meta: {
            roles: ['student']
          },
          component: Analyse
        },
        {
          path: '/Book',
          name: 'Book',
          meta: {
            roles: ['student']
          },
          component: Book
        },
        {
          path: '/Competition',
          name: 'Competition',
          meta: {
            roles: ['student']
          },
          component: Competition,
        },
        {
          path: '/CompetitionDetails',
          name: 'CompetitionDetails',
          meta: {
            roles: ['student']
          },
          component: CompetitionDetails
        },
        {
          path: '/Consolidate',
          name: 'Consolidate',
          meta: {
            roles: ['student']
          },
          component: Consolidate
        },
        {
          path: '/Pre_test',
          name: 'Pre_test',
          meta: {
            roles: ['student']
          },
          component: Pre_test
        },
        {
          path: '/unittest',
          name: 'unittest',
          meta: {
            roles: ['student']
          },
          component: unittest
        },
        {
          path: '/Textbook',
          name: 'Textbook',
          meta: {
            roles: ['student']
          },
          component: Textbook
        }
      ]
    }
  ]
})
