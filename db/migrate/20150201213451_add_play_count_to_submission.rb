class AddPlayCountToSubmission < ActiveRecord::Migration
  def change
    add_column :submissions, :play_count, :integer
  end
end
