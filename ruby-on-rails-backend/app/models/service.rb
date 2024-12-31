class Service < ApplicationRecord
  validates :slug, uniqueness: true
end
