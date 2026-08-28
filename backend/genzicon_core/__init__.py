# PyMySQL installation hook to support MySQL on all platforms without C-build toolchains
import pymysql
pymysql.install_as_MySQLdb()
