import os
import sys
import psycopg2
from psycopg2.extensions import AsIs
from sqlalchemy import create_engine
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy_utils import database_exists, create_database
from dotenv import load_dotenv

load_dotenv()

Base = declarative_base()


class Checkpoint(Base):
    __tablename__ = 'checkpoints'

    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)
    coordinates = Column(String(250), nullable=False)
    address = Column(String(250))
    description = Column(String(250))

    @property
    def serialize(self):

        return {
            'id': self.id,
            'name': self.name,
            'coordinates': self.coordinates,
            'address': self.address,
            'description': self.description
        }


engine = create_engine('postgresql://'+os.getenv('user') +
                       ':'+os.getenv('password')+'@localhost:5432/bestplaces')

if not database_exists(engine.url):
    create_database(engine.url)
    seed = True
else:
    seed = False

Base.metadata.create_all(engine)

if seed:
    DBSession = sessionmaker(bind=engine)
    session = DBSession()

    checkpoint1 = Checkpoint(
        name="Shopping Midway Mall",
        coordinates="-5.8120984,-35.2083838",
        address="Av. Bernardo Vieira, 3775 - Tirol, Natal - RN, 59015-900",
        description="Shopping Center"
    )
    session.add(checkpoint1)

    checkpoint2 = Checkpoint(
        name="Morro do Careca",
        coordinates="-5.8837034,-35.1653928",
        address="Praia de Ponta Negra s/n - Ponta Negra, Natal - RN, 59090-210",
        description="Atração turística"
    )
    session.add(checkpoint2)

    checkpoint3 = Checkpoint(
        name="Ponte Newton Navarro",
        coordinates="-5.7563336,-35.2045573",
        address="Pte. Newton Navarro - Redinha, Natal - RN",
        description="Ponte"
    )
    session.add(checkpoint3)

    checkpoint4 = Checkpoint(
        name="Arena das Dunas",
        coordinates="-5.8263732,-35.2183222",
        address="Av. Prudente de Morais, 5121 - Lagoa Nova, Natal - RN, 59075-000",
        description="Estádio de futebol"
    )
    session.add(checkpoint4)

    checkpoint5 = Checkpoint(
        name="Parque das Dunas",
        coordinates="-5.8106293,-35.1971743",
        address="Av. Alm. Alexandrino de Alencar, s/n - Tirol, Natal - RN, 59064-630",
        description="Parque ecológico"
    )
    session.add(checkpoint5)
    
    try:
        session.commit()
        pass
    except:
        session.rollback()