class Media < ApplicationRecord
  has_one_attached :file
  
  validates :file_name, presence: true
  validates :file_type, presence: true
end