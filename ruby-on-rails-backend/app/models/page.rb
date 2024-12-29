class Page < ApplicationRecord
  has_many :page_components
  has_many :media, through: :page_components
  
  validates :slug, presence: true, uniqueness: true
  validates :template_type, presence: true
  validates :title, presence: true
  validates :status, inclusion: { in: %w[draft published] }
end
