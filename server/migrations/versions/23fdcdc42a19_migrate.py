""" migrate

Revision ID: 23fdcdc42a19
Revises: 
Create Date: 2024-06-21 11:12:49.470974

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '23fdcdc42a19'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('book_clubs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('books',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=100), nullable=False),
    sa.Column('author', sa.String(length=100), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('image_url', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=100), nullable=False),
    sa.Column('_password_hash', sa.String(length=128), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('username')
    )
    op.create_table('assignments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('book_id', sa.Integer(), nullable=False),
    sa.Column('book_club_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['book_club_id'], ['book_clubs.id'], name=op.f('fk_assignments_book_club_id_book_clubs')),
    sa.ForeignKeyConstraint(['book_id'], ['books.id'], name=op.f('fk_assignments_book_id_books')),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('book_id', 'book_club_id', name='_book_club_assignment_uc')
    )
    op.create_table('memberships',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('book_club_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['book_club_id'], ['book_clubs.id'], name=op.f('fk_memberships_book_club_id_book_clubs'), ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_memberships_user_id_users'), ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('memberships')
    op.drop_table('assignments')
    op.drop_table('users')
    op.drop_table('books')
    op.drop_table('book_clubs')
    # ### end Alembic commands ###
