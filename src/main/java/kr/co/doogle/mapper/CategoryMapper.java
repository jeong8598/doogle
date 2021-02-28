package kr.co.doogle.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import kr.co.doogle.dto.CategoryDTO;

@Mapper
public interface CategoryMapper {

	@Select("${sql}")
	List<CategoryDTO> getQueryAll(@Param("sql") String sql);

	@Select("select * from category order by type asc, lv asc, idx asc")
	List<CategoryDTO> getAll();

	@Select("select ctno, name, lv, pctno, type, idx, writedate from (select seq, tt.* from (select rownum seq, t.* from (select * from category order by order by type asc, lv asc, idx asc) t) tt where seq >= ?) where rownum <= ?")
	List<CategoryDTO> getAllPage();

	@Select("select * from category where type = #{type} order by type asc, lv asc, idx asc")
	List<CategoryDTO> getAllType(@Param("type") String type);

	@Select("select ctno from category where name = #{name} and lv = #{lv}")
	int getCtno(@Param("name") String name, @Param("lv") int lv);

	@Insert("insert into category values(s_category.nextval(), #{dto.name}, #{dto.lv}, #{pctno}, #{dto.type}, sysdate)")
	int add(@Param("dto") CategoryDTO dto);

	@Insert("insert into category(ctno, name, lv, type, idx) values(s_category.nextval, #{dto.name}, #{dto.lv}, #{dto.type}, #{dto.idx})")
	int addCategory(@Param("dto") CategoryDTO dto);

	@Insert("insert into category(ctno, name, lv, type, idx, pctno) values(s_category.nextval, #{dto.name}, #{dto.lv}, #{dto.type}, #{dto.idx}, #{dto.pctno})")
	int addChildCategory(@Param("dto") CategoryDTO dto);

	@Update("update category set name = #{dto.name}, lv = #{dto.lv}, pctno = #{dto.pctno}, type = #{dto.type}, #{dto.writedate}")
	int mod(@Param("dto") CategoryDTO dto);

	@Delete("delete from category where ctno = #{ctno}")
	int del(@Param("ctno") int ctno);

	@Select("select count(*) from category")
	int getTotal();

}